import {
  Alchemy,
  Network,
  AssetTransfersCategory,
  AssetTransfersResult,
} from "alchemy-sdk";
import { formatEther, zeroAddress } from "viem";

import { fetchAssetTransfers } from "./alchemy";
import { Record } from "../types";
import getEnsName from "./ens";

const ALCHEMY_API_KEY = "1I-SRdvBCcKCuMCsFhU9CBmxbuK058eg";
// TODO: add info about the example wallet used
const walletAddress = "0xcDe0ce9646FF3BF7F938b32295295277F537476D";

interface NetworkConfig {
  name: string;
  network: Network;
  categories: AssetTransfersCategory[];
}

const networks: NetworkConfig[] = [
  {
    name: "ethereum",
    network: Network.ETH_MAINNET,
    categories: [
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.INTERNAL,
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.ERC721,
      AssetTransfersCategory.ERC1155,
    ],
  },
  {
    name: "base",
    network: Network.BASE_MAINNET,
    categories: [
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.ERC721,
      AssetTransfersCategory.ERC1155,
    ],
  },
];

function calculateTransferValue(transferValue: any): number {
  if (transferValue === null) return 0;

  if (typeof transferValue === "string") {
    // If it's already a string, it might be in wei format
    return Number(formatEther(BigInt(transferValue)));
  } else if (typeof transferValue === "number") {
    // If it's a number, assume it's already in ether
    return transferValue;
  } else {
    // For any other type, convert to string and then to ether
    return Number(formatEther(BigInt(transferValue.toString())));
  }
}

async function processTransfers(
  result: AssetTransfersResult
): Promise<Map<string, Record>> {
  const records: Map<string, Record> = new Map();

  // The results have the following structure:
  // - asset
  // - category; eg. erc20
  // - to
  // - rawContract
  //   - address
  // - value

  // TODO: aggregate transfers by a few criteria
  // - if category is erc20, aggregate by `rawContract.address`; the totalValue and txnsCount should be summed up
  // - if category is external, aggregate by `to`; the totalValue and txnsCount should be summed up
  // - for any other category, skip

  // @ts-ignore
  for (const transfer of result.transfers) {
    const toAddress = transfer.to;
    // TODO: maybe explain why we skip transfers with no to address
    if (!toAddress) continue;

    const value = calculateTransferValue(transfer.value);

    if (transfer.category === AssetTransfersCategory.ERC20) {
      const contractAddress = transfer.rawContract.address;
      const onchainName = transfer.asset;
      if (!records.has(contractAddress)) {
        records.set(contractAddress, {
          hexAddress: contractAddress,
          hexAddressName: null,
          onchainName: onchainName,
          onchainNameSource: "ERC20 .name() method",
          totalValue: 0,
          txnsCount: 0,
          platform: "",
        });
      }
      const record = records.get(contractAddress)!;
      record.txnsCount++;
      record.totalValue += value;
    } else if (transfer.category === AssetTransfersCategory.EXTERNAL) {
      const onchainName = transfer.asset;
      const onchainNameSource = "native token";
      if (!records.has(toAddress)) {
        records.set(toAddress, {
          hexAddress: toAddress,
          hexAddressName: null,
          onchainName: onchainName,
          onchainNameSource: onchainNameSource,
          totalValue: 0,
          txnsCount: 0,
          platform: "",
        });
      }
      const record = records.get(toAddress)!;
      record.txnsCount++;
      record.totalValue += value;
    } else {
      // Skip
      continue;
    }
  }

  return records;
}

function sortAndLimitInteractions(
  interactions: Map<string, Record>,
  limit: number
): Record[] {
  return Array.from(interactions.values())
    .sort((a, b) => b.txnsCount - a.txnsCount)
    .slice(0, limit);
}

async function populateOnchainNames(interactions: Record[]) {
  for (const interaction of interactions) {
    interaction.onchainName = await getEnsName(
      interaction.hexAddress as `0x${string}`
    );
  }
}

async function getTopInteractions(
  address: string,
  networkConfig: NetworkConfig
): Promise<Record[]> {
  const alchemy = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    network: networkConfig.network,
  });

  try {
    const result = await fetchAssetTransfers(
      alchemy,
      address,
      networkConfig.categories
    );
    const interactions = await processTransfers(result);
    const sortedInteractions = sortAndLimitInteractions(interactions, 5);
    // await populateOnchainNames(sortedInteractions);
    return sortedInteractions;
  } catch (error) {
    console.error(
      `Error fetching transactions for ${networkConfig.name}:`,
      error
    );
    return [];
  }
}

async function getTransactionsForAllNetworks(
  address: string
): Promise<Record[]> {
  const results = await Promise.all(
    networks.map(async (network) => {
      const interactions = await getTopInteractions(address, network);
      return interactions.map((interaction) => ({
        ...interaction,
        platform: network.name,
      }));
    })
  );

  return results.flat().sort((a, b) => b.txnsCount - a.txnsCount);
}

async function main() {
  const records = await getTransactionsForAllNetworks(walletAddress);
  return { records };
}

export { main };

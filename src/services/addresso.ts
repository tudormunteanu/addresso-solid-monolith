import {
  Alchemy,
  Network,
  AssetTransfersCategory,
  AssetTransfersResult,
} from "alchemy-sdk";
import { formatEther, zeroAddress } from "viem";

import { fetchAssetTransfers } from "./alchemy";
import { Interaction, IdentityHubRecord } from "../types";
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
): Promise<Map<string, Interaction>> {
  const interactions: Map<string, Interaction> = new Map();

  // @ts-ignore
  for (const transfer of result.transfers) {
    const toAddress = transfer.to;
    // TODO: maybe explain why we skip transfers with no to address
    if (!toAddress) continue;

    const value = calculateTransferValue(transfer.value);

    if (!interactions.has(toAddress)) {
      interactions.set(toAddress, {
        toContractAddress: toAddress,
        toContractLabel: null,
        txnsCount: 0,
        txnsStats: {},
      });
    }

    const interaction = interactions.get(toAddress)!;
    interaction.txnsCount++;

    const asset = transfer.asset;
    const contractAddress = transfer.rawContract.address || zeroAddress;

    if (!interaction.txnsStats[asset]) {
      interaction.txnsStats[asset] = {
        asset,
        assetContractAddress: contractAddress,
        count: 0,
        value: 0,
      };
    }
    interaction.txnsStats[asset].count++;
    interaction.txnsStats[asset].value += value;
  }

  return interactions;
}

function sortAndLimitInteractions(
  interactions: Map<string, Interaction>,
  limit: number
): Interaction[] {
  return Array.from(interactions.values())
    .sort((a, b) => b.txnsCount - a.txnsCount)
    .slice(0, limit);
}

async function populateContractLabels(interactions: Interaction[]) {
  for (const interaction of interactions) {
    interaction.toContractLabel = await getEnsName(
      interaction.toContractAddress as `0x${string}`
    );
  }
}

async function getTopInteractions(
  address: string,
  networkConfig: NetworkConfig
): Promise<Interaction[]> {
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
    await populateContractLabels(sortedInteractions);
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
): Promise<IdentityHubRecord[]> {
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
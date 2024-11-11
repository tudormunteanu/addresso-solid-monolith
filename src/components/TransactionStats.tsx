import { Component, For } from "solid-js";
import { AssetStats } from "@project/shared";
import { PlatformConfig } from "../config/platforms";
import AddressLabelEditor from "./AddressLabelEditor";

interface TransactionStatsProps {
  stats: { [key: string]: AssetStats };
  platform: PlatformConfig;
  onEditLabel: (address: string) => void;
  onSaveLabel: (address: string, newLabel: string) => void;
  currentLabels: { [address: string]: string | null };
}

const TransactionStats: Component<TransactionStatsProps> = (props) => {
  return (
    <details class="mt-2">
      <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
        View Transactions
      </summary>
      <div class="mt-2 pl-4 space-y-10">
        <For each={Object.values(props.stats)}>
          {(stat) => (
            <div class="text-sm text-gray-600 pb-2 border-b border-gray-200 last:border-b-0">
              <AddressLabelEditor
                address={stat.assetContractAddress}
                currentLabel={
                  props.currentLabels[stat.assetContractAddress] || null
                }
                onEdit={props.onEditLabel}
                onSave={props.onSaveLabel}
                getExplorerUrl={(_, address) =>
                  props.platform.getExplorerUrl(address)
                }
                platform={props.platform.name}
              />
              <div class="flex justify-between items-center">
                <span class="font-medium">Token: {stat.asset}</span>
                <span>{stat.count} transactions</span>
              </div>
              <div class="text-xs text-gray-500">
                Total value: {stat.value.toFixed(4)}
              </div>
            </div>
          )}
        </For>
      </div>
    </details>
  );
};

export default TransactionStats;

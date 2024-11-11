export type AssetStats = {
  asset: string;
  assetContractAddress: string;
  count: number;
  value: number;
};

export type Interaction = {
  toContractAddress: string;
  toContractLabel: string | null;
  txnsCount: number;
  txnsStats: {
    [key: string]: AssetStats;
  };
};

export type IdentityHubRecord = Interaction & {
  platform: string;
};

export type TxnStat = {
  asset: string;
  assetContractAddress: string;
  count: number;
  value: number;
};

export type Record = {
  platform: string;
  toContractAddress: string;
  toContractLabel: string | null;
  txnsCount: number;
  txnsStats: {
    [key: string]: TxnStat;
  };
};

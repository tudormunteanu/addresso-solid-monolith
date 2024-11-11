export type Record = {
  hexAddress: string;
  hexAddressName: string | null;
  // Could be ENS, ERC20.name, ERC721.name, etc.
  onchainName: string | null;
  onchainNameSource: string | null;
  totalValue: number;
  txnsCount: number;
  platform: string;
};

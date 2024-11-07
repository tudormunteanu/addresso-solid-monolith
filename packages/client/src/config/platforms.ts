export interface PlatformConfig {
  name: string;
  getExplorerUrl: (address: string) => string;
}

export const platforms: { [key: string]: PlatformConfig } = {
  ethereum: {
    name: "Ethereum",
    getExplorerUrl: (address: string) =>
      `https://etherscan.io/address/${address}`,
  },
  base: {
    name: "Base",
    getExplorerUrl: (address: string) =>
      `https://basescan.org/address/${address}`,
  },
  // Easy to add more platforms:
  // optimism: {
  //   name: "Optimism",
  //   getExplorerUrl: (address: string) => `https://optimistic.etherscan.io/address/${address}`,
  // },
};

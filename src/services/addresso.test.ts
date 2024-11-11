import { describe, it, expect, vi } from "vitest";
import { main } from "./addresso";
import { fetchAssetTransfers } from "./alchemy";
import { AssetTransfersCategory } from "alchemy-sdk";
import getEnsName from "./ens";

vi.mock("./alchemy", () => ({
  fetchAssetTransfers: vi.fn(),
}));

vi.mock("./ens", () => ({
  default: vi.fn(),
}));

describe("addresso", () => {
  it("should process transfers and return records", async () => {
    const mockTransfer = {
      transfers: [
        {
          to: "0x1234567890123456789012345678901234567890",
          // 1 ETH in wei
          category: AssetTransfersCategory.EXTERNAL,
          value: "1000000000000000000",
          asset: "ETH",
          rawContract: {
            address: "0x0000000000000000000000000000000000000000",
          },
        },
      ],
    };

    (fetchAssetTransfers as any).mockResolvedValue(mockTransfer);
    (getEnsName as any).mockResolvedValue(null);

    const result = await main();

    // Verify the structure of the response
    expect(result).toHaveProperty("records");
    expect(Array.isArray(result.records)).toBe(true);

    // Check the first record
    const firstRecord = result.records[0];
    expect(firstRecord).toMatchObject({
      hexAddress: "0x1234567890123456789012345678901234567890",
      hexAddressName: null,
      onchainName: "ETH (source: native token)",
      totalValue: 1,
      txnsCount: 1,
      platform: expect.stringMatching(/^(ethereum|base)$/),
    });
  });
});

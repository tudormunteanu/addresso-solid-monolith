import { describe, it, expect, vi } from "vitest";
import { main } from "./addresso";
import { fetchAssetTransfers } from "./alchemy";
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
          value: "1000000000000000000", // 1 ETH in wei
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
      toContractAddress: "0x1234567890123456789012345678901234567890",
      toContractLabel: null,
      txnsCount: 1,
      platform: expect.stringMatching(/^(ethereum|base)$/),
    });

    // Verify transaction stats
    expect(firstRecord.txnsStats).toHaveProperty("ETH");
    expect(firstRecord.txnsStats.ETH).toMatchObject({
      asset: "ETH",
      count: 1,
      value: 1, // Should be converted from wei to ETH
    });
  });
});
         
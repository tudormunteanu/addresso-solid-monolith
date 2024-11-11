import { render, screen, waitFor } from "@solidjs/testing-library";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Records } from "./Records";


describe("Records", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should show loading message initially", () => {
    render(() => <Records />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should fetch and display records from API", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          records: [
            {
              platform: "ethereum",
              toContractAddress: "0x0000000000000000000000000000000000000000",
              toContractLabel: null,
              txnsCount: 1,
              txnsStats: {
                USDC: {
                  asset: "USDC",
                  assetContractAddress:
                    "0x0000000000000000000000000000000000000000",
                  count: 1,
                  value: 100,
                },
              },
            },
          ],
        }),
      ok: true,
    });

    render(() => <Records />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("ethereum")).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith("/api/addresso");
  });

  it("should handle API errors gracefully", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("API Error"));

    render(() => <Records />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load message. Please try again later.")
      ).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith("/api/addresso");
  });
});

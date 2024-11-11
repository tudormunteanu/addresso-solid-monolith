import { render, screen, waitFor } from "@solidjs/testing-library";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Records } from "./Records";
import { main as fetchRecords } from "./services/addresso";

// Mock at the top level
vi.mock("./services/addresso", () => ({
  main: vi.fn(),
}));

describe("Records", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Set up the mock implementation for each test
    (fetchRecords as any).mockResolvedValue({
      records: [
        {
          platform: "ethereum",
          toContractAddress: "0x0000000000000000000000000000000000000000",
          toContractLabel: null,
          txnsCount: 1,
          txnsStats: {
            USDC: {
              asset: "USDC",
              assetContractAddress: "0x0000000000000000000000000000000000000000",
              count: 1,
              value: 100,
            },
          },
        },
      ],
    });
  });

  it("should show loading message initially", () => {
    render(() => <Records />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should fetch and display records from API", async () => {
    render(() => <Records />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
    });

    expect(fetchRecords).toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    (fetchRecords as any).mockRejectedValue(new Error("API Error"));

    render(() => <Records />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load message. Please try again later.")
      ).toBeInTheDocument();
    });

    expect(fetchRecords).toHaveBeenCalled();
  });
});

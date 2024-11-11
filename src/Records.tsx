import { Component, createSignal, onMount } from "solid-js";
import "./index.css";
import Footer from "./components/Footer";
import { Record } from "./types";
import { platforms } from "./config/platforms";
import AddressLabelEditor from "./components/AddressLabelEditor";

import { main as fetchRecords } from "./services/addresso";

const getExplorerUrl = (platform: string, address: string) => {
  const baseUrl =
    platform.toLowerCase() === "base"
      ? "https://basescan.org"
      : "https://etherscan.io";
  return `${baseUrl}/address/${address}`;
};

export const Records: Component = () => {
  const [records, setRecords] = createSignal<Record[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);

  const handleSaveLabel = (address: string, newLabelValue: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.hexAddress === address
          ? { ...record, hexAddressName: newLabelValue || null }
          : record
      )
    );
  };

  onMount(async () => {
    try {
      const data = await fetchRecords();
      setRecords(data.records);
    } catch (error) {
      setError("Failed to load message. Please try again later.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto p-4">
        {/* Hero Section */}
        <div class="text-center py-8 mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Your Web3 Address Book
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Track and manage your interactions across Ethereum and Base. View
            your transaction history, label addresses for easy reference, and
            quickly access frequently used contracts. (this text is a generated
            placeholder. TBD)
          </p>
        </div>

        {/* Search Bar */}
        <div class="mb-6">
          <input
            type="text"
            placeholder="Search"
            class="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Records List */}
        <div class="space-y-4 mb-20">
          {loading() ? (
            <div class="text-center py-8 text-gray-600">Loading...</div>
          ) : error() ? (
            <div class="text-center py-8 text-red-600">{error()}</div>
          ) : (
            records().map((record) => (
              <div class="bg-white rounded-lg shadow p-4 flex justify-between items-start">
                <div class="flex-1">
                  <AddressLabelEditor
                    address={record.hexAddress}
                    currentLabel={record.hexAddressName}
                    onEdit={() => {}}
                    onSave={handleSaveLabel}
                    getExplorerUrl={getExplorerUrl}
                    platform={record.platform}
                  />

                  {/* TODO: add the platform name */}
                  <div class="text-sm text-gray-500">
                    <strong>Blockchain:</strong>{" "}
                    <span>{platforms[record.platform].name}</span>
                  </div>

                  <div class="text-sm text-gray-500 mt-2">
                    <strong>On-chain Name:</strong>{" "}
                    <span>{record.onchainName || "not found"}</span>
                    {" "}
                    <span class="text-xs text-gray-500">
                      ({record.onchainNameSource || ""})
                    </span>
                  </div>

                  <div class="text-sm text-gray-500 mt-2">
                    <div class="flex items-center gap-2">
                      <strong>Stats:</strong>
                      <span>
                        {record.txnsCount} transactions; total value:{" "}
                        {record.totalValue?.toFixed(4) || "unknown"} {record.onchainName || ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div class="flex space-x-2">
                  <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                    Visit
                  </button>
                  <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                    Pay
                  </button>
                  <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                    Swap
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

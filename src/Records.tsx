import { Component, createSignal, onMount } from "solid-js";
import "./index.css";
import Footer from "./components/Footer";
import TransactionStats from "./components/TransactionStats";
import { IdentityHubRecord } from "./types";
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
  const [records, setRecords] = createSignal<IdentityHubRecord[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);

  const handleSaveLabel = (address: string, newLabelValue: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.toContractAddress === address
          ? { ...record, toContractLabel: newLabelValue || null }
          : record
      )
    );
  };

  onMount(async () => {
    const data = await fetchRecords();
    // setRecords(data.records);
    setLoading(false);
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
          ) : (
            records().map((record) => (
              <div class="bg-white rounded-lg shadow p-4 flex justify-between items-start">
                <div class="flex-1">
                  <AddressLabelEditor
                    address={record.toContractAddress}
                    currentLabel={record.toContractLabel}
                    onEdit={() => {}}
                    onSave={handleSaveLabel}
                    getExplorerUrl={getExplorerUrl}
                    platform={record.platform}
                  />

                  {/* TODO: add the platform name */}
                  <div class="text-sm text-gray-500">
                    <strong>Blockchain:</strong>{" "}
                    {platforms[record.platform].name}
                  </div>

                  <div class="text-sm text-gray-500 mt-2">
                    <strong>ENS:</strong> not found
                  </div>

                  <div class="text-sm text-gray-500 mt-2">
                    <strong>Type:</strong> wallet | contract
                  </div>

                  <div class="text-sm text-gray-500 mt-2">
                    <div class="flex items-center gap-2">
                      <strong>Stats:</strong>
                      <span>
                        {record.txnsCount} transactions; total value: 999 ETH
                      </span>
                    </div>
                    <TransactionStats
                      stats={record.txnsStats}
                      platform={platforms[record.platform]}
                      onEditLabel={() => {}}
                      onSaveLabel={handleSaveLabel}
                      currentLabels={records().reduce(
                        (acc, rec) => ({
                          ...acc,
                          [rec.toContractAddress]: rec.toContractLabel,
                        }),
                        {}
                      )}
                    />
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
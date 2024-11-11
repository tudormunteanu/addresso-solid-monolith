import { Component, createSignal } from "solid-js";
import ExternalLink from "./ExternalLink";
import CopyButton from "./CopyButton";

interface AddressLabelEditorProps {
  address: string;
  currentLabel: string | null;
  onEdit: (address: string) => void;
  onSave: (address: string, newLabel: string) => void;
  getExplorerUrl: (platform: string, address: string) => string;
  platform: string;
}

const AddressLabelEditor: Component<AddressLabelEditorProps> = ({
  address,
  currentLabel,
  onEdit,
  onSave,
  getExplorerUrl,
  platform,
}) => {
  const [editing, setEditing] = createSignal(false);
  const [label, setLabel] = createSignal(currentLabel || "");

  const handleSave = () => {
    onSave(address, label());
    setEditing(false);
  };

  return (
    <div class="mb-4">
      {editing() ? (
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input
              type="text"
              value={label()}
              onInput={(e) => setLabel(e.currentTarget.value)}
              class="px-3 py-2 border rounded text-lg"
              placeholder="Enter name"
            />
            <button
              onClick={handleSave}
              class="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              class="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
          <div class="text-sm font-mono text-gray-500">
            {address}
            <span class="inline-flex ml-2">
              <CopyButton />
              <ExternalLink
                href={getExplorerUrl(platform, address)}
                title="View on explorer"
              />
            </span>
          </div>
        </div>
      ) : (
        <div class="flex flex-col gap-1 bg-gray-100 p-2 mr-2 rounded">
          <div class="flex items-center gap-2">
            <span class="text-lg font-semibold">
              {currentLabel ? (
                currentLabel
              ) : (
                <span class="text-gray-400 italic">No name set</span>
              )}
            </span>
            <button
              onClick={() => setEditing(true)}
              class="px-2 py-1 text-sm bg-green-100 rounded hover:bg-green-200"
            >
              {currentLabel ? "Edit" : "Set name"}
            </button>
          </div>
          <div class="text-sm font-mono text-gray-500">
            <strong>Contract address:</strong> {address}
            <span class="inline-flex ml-2">
              <CopyButton />
              <ExternalLink
                href={getExplorerUrl(platform, address)}
                title="View on explorer"
              />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressLabelEditor;

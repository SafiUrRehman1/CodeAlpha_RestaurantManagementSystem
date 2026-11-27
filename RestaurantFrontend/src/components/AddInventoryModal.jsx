
import { useState } from "react";
import { X, PackagePlus, AlertCircle } from "lucide-react";
import api from "../services/api";

export default function AddInventoryModal({
  isOpen,
  onClose,
  loadInventory,
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Item name is required.");
      return;
    }

    if (
      quantity === "" ||
      minimumStock === "" ||
      Number(quantity) < 0 ||
      Number(minimumStock) < 0
    ) {
      setError("Enter valid quantities. Values cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/inventoryitems", {
        name: name.trim(),
        quantity: Number(quantity),
        minimumStock: Number(minimumStock),
      });

      await loadInventory();

      setName("");
      setQuantity("");
      setMinimumStock("");
      onClose();
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to add inventory item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5">
      <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-[#B95F3B]">
              <PackagePlus size={21} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25221F] sm:text-2xl">
                Add Inventory Item
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Add a supply to your inventory
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {error && (
          <div className="mb-5 flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cooking Oil"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Current Quantity
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter current quantity"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Minimum Stock Level
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={minimumStock}
              onChange={(e) => setMinimumStock(e.target.value)}
              placeholder="Enter minimum stock level"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              required
            />
            <p className="mt-1.5 text-xs text-gray-400">
              An item is marked low stock according to your backend's stock rule.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !name.trim() ||
                quantity === "" ||
                minimumStock === "" ||
                Number(quantity) < 0 ||
                Number(minimumStock) < 0
              }
              className="rounded-xl bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Inventory Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

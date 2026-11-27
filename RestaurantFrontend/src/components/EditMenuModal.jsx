
import { useEffect, useState } from "react";
import { X, Pencil, AlertCircle } from "lucide-react";
import api from "../services/api";

export default function EditMenuModal({
  isOpen,
  onClose,
  selectedItem,
  loadMenuItems,
}) {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setItemName(selectedItem.itemName || "");
      setPrice(String(selectedItem.price ?? ""));
      setIsAvailable(Boolean(selectedItem.isAvailable));
      setError("");
    }
  }, [selectedItem]);

  if (!isOpen || !selectedItem) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put(`/menu/${selectedItem.id}`, {
        itemName: itemName.trim(),
        price: Number(price),
        isAvailable,
      });

      await loadMenuItems();
      onClose();
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Unable to update menu item. Please try again."
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
              <Pencil size={21} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25221F] sm:text-2xl">
                Edit Menu Item
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Update the dish details and availability
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
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Price (Rs.)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              required
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#FAF8F4] p-4">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-4 w-4 accent-[#B95F3B]"
            />
            <span className="text-sm font-medium text-gray-700">
              Item is available for customers
            </span>
          </label>

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
              disabled={loading || !itemName.trim() || !price || Number(price) <= 0}
              className="rounded-xl bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

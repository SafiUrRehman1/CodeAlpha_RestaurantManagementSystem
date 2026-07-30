import { useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";

export default function AddMenuModal({
  isOpen,
  onClose,
  loadMenuItems,
}) {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/menu", {
        itemName,
        price: Number(price),
        isAvailable,
      });

      setItemName("");
      setPrice("");
      setIsAvailable(true);

      await loadMenuItems();

      onClose();

    } catch (err) {
      setError(err.response?.data || "Failed to add menu item.");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Add Menu Item
          </h2>

          <button
            onClick={onClose}
            className="hover:text-red-500"
          >
            <X size={24}/>
          </button>

        </div>

        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Item Name
            </label>

            <input
              type="text"
              value={itemName}
              onChange={(e)=>setItemName(e.target.value)}
              className="w-full border rounded-xl p-3"
              placeholder="Chicken Burger"
              required
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              className="w-full border rounded-xl p-3"
              placeholder="700"
              required
            />

          </div>

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e)=>setIsAvailable(e.target.checked)}
            />

            <label>
              Available
            </label>

          </div>

          <div className="flex justify-end gap-4 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
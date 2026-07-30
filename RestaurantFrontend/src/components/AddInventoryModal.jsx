import { useState } from "react";
import api from "../services/api";

export default function AddInventoryModal({
  isOpen,
  onClose,
  loadInventory,
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Item name is required.");
      return;
    }

    if (quantity < 0 || minimumStock < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    try {
      await api.post("/inventoryitems", {
        name,
        quantity: Number(quantity),
        minimumStock: Number(minimumStock),
      });

      await loadInventory();

      setName("");
      setQuantity("");
      setMinimumStock("");

      onClose();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data ||
          "Failed to add inventory item."
      );
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          Add Inventory Item
        </h2>

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
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Quantity
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Minimum Stock
            </label>

            <input
              type="number"
              value={minimumStock}
              onChange={(e) =>
                setMinimumStock(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
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
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Item
            </button>

          </div>
        </form>

      </div>

    </div>
  );
}
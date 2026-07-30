import { useEffect, useState } from "react";
import api from "../services/api";

export default function EditInventoryModal({
  isOpen,
  onClose,
  item,
  loadInventory,
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setMinimumStock(item.minimumStock);
    }
  }, [item]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put(`/InventoryItems/${item.id}`, {
        name,
        quantity: Number(quantity),
        minimumStock: Number(minimumStock),
      });

      await loadInventory();

      onClose();
    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Failed to update item.");
    }
  }

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          Edit Inventory Item
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
              onChange={(e)=>setName(e.target.value)}
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
              onChange={(e)=>setQuantity(e.target.value)}
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
              onChange={(e)=>setMinimumStock(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
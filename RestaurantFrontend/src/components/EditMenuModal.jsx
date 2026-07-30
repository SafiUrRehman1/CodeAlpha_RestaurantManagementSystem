import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (selectedItem) {
      setItemName(selectedItem.itemName);
      setPrice(selectedItem.price);
      setIsAvailable(selectedItem.isAvailable);
    }
  }, [selectedItem]);

  if (!isOpen || !selectedItem) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put(`/menu/${selectedItem.id}`, {
        itemName,
        price: Number(price),
        isAvailable,
      });

      await loadMenuItems();

      onClose();
    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Unable to update menu item.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white rounded-2xl w-[500px] p-8 shadow-xl">

        <h2 className="text-3xl font-bold mb-6">
          Edit Menu Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>

            <label className="font-medium">
              Item Name
            </label>

            <input
              type="text"
              value={itemName}
              onChange={(e)=>setItemName(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-medium">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e)=>setIsAvailable(e.target.checked)}
            />

            <span>Available</span>

          </div>

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../services/api";

export default function EditTableModal({
  isOpen,
  onClose,
  table,
  loadTables,
}) {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (table) {
      setTableNumber(table.tableNumber);
      setCapacity(table.capacity);
    }
  }, [table]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!tableNumber) {
      alert("Table number is required.");
      return;
    }

    if (capacity <= 0 || capacity > 20) {
      alert("Capacity must be between 1 and 20.");
      return;
    }

    try {
      await api.put(`/tables/${table.id}`, {
        tableNumber: Number(tableNumber),
        capacity: Number(capacity),
      });

      await loadTables();

      onClose();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data ||
        "Failed to update table."
      );
    }
  }

  if (!isOpen || !table) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          Edit Table
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Table Number
            </label>

            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Capacity
            </label>

            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-4 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
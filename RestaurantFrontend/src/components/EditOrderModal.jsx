import { useEffect, useState } from "react";
import api from "../services/api";

export default function EditOrderModal({
  isOpen,
  onClose,
  order,
  loadOrders,
}) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  async function handleSave() {
    try {
      await api.patch(`/orders/${order.id}/status`, {
        status,
      });

      await loadOrders();

      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-[420px] p-8">

        <h2 className="text-2xl font-bold mb-6">
          Update Order
        </h2>

        <div className="space-y-5">

          <div>

            <label className="font-semibold block mb-2">
              Customer
            </label>

            <input
              value={order.customerName}
              disabled
              className="w-full border rounded-xl p-3 bg-gray-100"
            />

          </div>

          <div>

            <label className="font-semibold block mb-2">
              Total
            </label>

            <input
              value={`Rs. ${order.totalAmount}`}
              disabled
              className="w-full border rounded-xl p-3 bg-gray-100"
            />

          </div>

          <div>

            <label className="font-semibold block mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-xl p-3"
            >
              <option>Pending</option>
              <option>Preparing</option>
              <option>Ready</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}
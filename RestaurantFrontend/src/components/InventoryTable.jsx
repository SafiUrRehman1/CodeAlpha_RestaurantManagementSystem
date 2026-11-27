
import { useState } from "react";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";

import DeleteConfirmModal from "./DeleteConfirmModal";
import api from "../services/api";

export default function InventoryTable({
  inventoryItems,
  loadInventory,
  setSelectedItem,
  setShowEditModal,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function deleteItem() {
    if (!itemToDelete) return;

    try {
      setDeleting(true);

      await api.delete(`/InventoryItems/${itemToDelete.id}`);
      await loadInventory();

      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      alert(error.response?.data || "Unable to delete inventory item.");
    } finally {
      setDeleting(false);
    }
  }

  function editItem(item) {
    setSelectedItem(item);
    setShowEditModal(true);
  }

  function ActionButtons({ item }) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => editItem(item)}
          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
          title="Edit item"
          aria-label={`Edit ${item.name}`}
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => {
            setItemToDelete(item);
            setShowDeleteModal(true);
          }}
          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
          title="Delete item"
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  function StockStatus({ item }) {
    return item.isLowStock ? (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
        <AlertTriangle size={14} />
        Low Stock
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
        <CheckCircle2 size={14} />
        Healthy
      </span>
    );
  }

  return (
    <>
      {inventoryItems.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F0E7] text-[#B95F3B]">
            <Package size={27} />
          </div>

          <h3 className="font-semibold text-[#25221F]">
            No inventory items found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or stock filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-[#F5F0E7] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Item Name</th>
                  <th className="px-6 py-4 font-semibold">Quantity</th>
                  <th className="px-6 py-4 font-semibold">Minimum Stock</th>
                  <th className="px-6 py-4 font-semibold">Stock Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {inventoryItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[#FAF8F4]"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-[#25221F]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Item #{item.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 font-semibold text-[#25221F]">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {item.minimumStock}
                    </td>

                    <td className="px-6 py-5">
                      <StockStatus item={item} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <ActionButtons item={item} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {inventoryItems.map((item) => (
              <div key={item.id} className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-[#25221F]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Item #{item.id}
                    </p>
                  </div>

                  <StockStatus item={item} />
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#FAF8F4] p-3">
                  <div>
                    <p className="text-xs text-gray-500">Current Quantity</p>
                    <p className="mt-1 text-lg font-bold text-[#25221F]">
                      {item.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Minimum Stock</p>
                    <p className="mt-1 text-lg font-bold text-[#25221F]">
                      {item.minimumStock}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <ActionButtons item={item} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Inventory Item"
        message={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.name}"?`
            : ""
        }
        onCancel={() => {
          if (deleting) return;
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={deleteItem}
      />
    </>
  );
}

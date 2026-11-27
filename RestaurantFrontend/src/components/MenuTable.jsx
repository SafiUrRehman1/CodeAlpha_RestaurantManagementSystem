
import { useState } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Ban,
  RotateCcw,
} from "lucide-react";

import DeleteConfirmModal from "./DeleteConfirmModal";
import api from "../services/api";

export default function MenuTable({
  menuItems,
  loadMenuItems,
  setSelectedItem,
  setShowEditModal,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  async function toggleAvailability(item) {
    try {
      if (item.isAvailable) {
        await api.patch(`/menu/${item.id}/disable`);
      } else {
        await api.patch(`/menu/${item.id}/enable`);
      }

      await loadMenuItems();
    } catch (error) {
      console.error("Failed to update availability:", error);
      alert(error.response?.data || "Unable to update item availability.");
    }
  }

  async function deleteItem() {
    if (!itemToDelete) return;

    try {
      await api.delete(`/menu/${itemToDelete.id}`);
      await loadMenuItems();

      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      alert(error.response?.data || "Unable to delete menu item.");
    }
  }

  function editItem(item) {
    setSelectedItem(item);
    setShowEditModal(true);
  }

  function confirmDelete(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  function ActionButtons({ item }) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => editItem(item)}
          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
          title="Edit item"
          aria-label={`Edit ${item.itemName}`}
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => toggleAvailability(item)}
          className={`rounded-lg p-2 transition ${
            item.isAvailable
              ? "text-orange-600 hover:bg-orange-50"
              : "text-green-600 hover:bg-green-50"
          }`}
          title={item.isAvailable ? "Disable item" : "Enable item"}
          aria-label={`${item.isAvailable ? "Disable" : "Enable"} ${item.itemName}`}
        >
          {item.isAvailable ? (
            <Ban size={18} />
          ) : (
            <RotateCcw size={18} />
          )}
        </button>

        <button
          onClick={() => confirmDelete(item)}
          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
          title="Delete item"
          aria-label={`Delete ${item.itemName}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <>
      {menuItems.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F0E7] text-[#B95F3B]">
            <XCircle size={26} />
          </div>
          <h3 className="font-semibold text-[#25221F]">
            No menu items found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or availability filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-[#F5F0E7] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Menu Item</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Availability</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {menuItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[#FAF8F4]"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-[#25221F]">
                        {item.itemName}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Item #{item.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 font-semibold text-[#25221F]">
                      Rs. {Number(item.price || 0).toLocaleString("en-PK")}
                    </td>

                    <td className="px-6 py-5">
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                          <CheckCircle2 size={14} />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                          <XCircle size={14} />
                          Disabled
                        </span>
                      )}
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
            {menuItems.map((item) => (
              <div key={item.id} className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-[#25221F]">
                      {item.itemName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Item #{item.id}
                    </p>
                  </div>

                  {item.isAvailable ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 size={13} />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                      <XCircle size={13} />
                      Disabled
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                  <p className="text-lg font-bold text-[#B95F3B]">
                    Rs. {Number(item.price || 0).toLocaleString("en-PK")}
                  </p>
                  <ActionButtons item={item} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Menu Item"
        message={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.itemName}"?`
            : ""
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={deleteItem}
      />
    </>
  );
}

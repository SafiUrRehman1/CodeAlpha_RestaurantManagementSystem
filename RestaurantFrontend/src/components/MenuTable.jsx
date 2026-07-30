import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Ban,
  RotateCcw,
} from "lucide-react";

import { useState } from "react";
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

      loadMenuItems();

    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Something went wrong.");
    }
  }

  async function deleteItem() {
  try {

    await api.delete(`/menu/${itemToDelete.id}`);

    await loadMenuItems();

    setShowDeleteModal(false);

    setItemToDelete(null);

  } catch (error) {
    console.log(error);
  }
}

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-4">Item</th>

            <th className="text-left py-4">Price</th>

            <th className="text-left py-4">Status</th>

            <th className="text-center py-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {menuItems.length === 0 ? (

            <tr>

              <td
                colSpan="4"
                className="text-center py-10 text-gray-500"
              >
                No menu items found.
              </td>

            </tr>

          ) : (

            menuItems.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="py-5 font-semibold">
                  {item.itemName}
                </td>

                <td>
                  Rs. {item.price}
                </td>

                <td>

                  {item.isAvailable ? (

                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                      <CheckCircle size={16} />

                      Available

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                      <XCircle size={16} />

                      Disabled

                    </span>

                  )}

                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    {/* Edit */}

                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>

                    {/* Enable / Disable */}

                    <button
                      onClick={() => toggleAvailability(item)}
                      className={
                        item.isAvailable
                          ? "text-orange-600 hover:text-orange-800 transition"
                          : "text-green-600 hover:text-green-800 transition"
                      }
                      title={
                        item.isAvailable
                          ? "Disable Item"
                          : "Enable Item"
                      }
                    >
                      {item.isAvailable ? (
                        <Ban size={20} />
                      ) : (
                        <RotateCcw size={20} />
                      )}
                    </button>

                    {/* Delete */}
<button
  onClick={() => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }}
  className="text-red-600 hover:text-red-800"
>
  <Trash2 size={20}/>
</button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>
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

    </div>
  );
}
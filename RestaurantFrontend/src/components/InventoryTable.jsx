import {
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { useState } from "react";
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

async function deleteItem() {
  try {
    await api.delete(`/InventoryItems/${itemToDelete.id}`);

    await loadInventory();

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

            <th className="text-left py-4">Name</th>

            <th className="text-left py-4">Quantity</th>

            <th className="text-left py-4">Minimum Stock</th>

            <th className="text-left py-4">Status</th>

            <th className="text-center py-4">Actions</th>

          </tr>
        </thead>

        <tbody>

          {inventoryItems.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center py-10 text-gray-500"
              >
                No inventory items found.
              </td>
            </tr>
          ) : (

            inventoryItems.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="py-5 font-semibold">
                  {item.name}
                </td>

                <td>
                  {item.quantity}
                </td>

                <td>
                  {item.minimumStock}
                </td>

                <td>

                  {item.isLowStock ? (

                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                      <AlertTriangle size={16} />

                      Low Stock

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                      <CheckCircle size={16} />

                      Healthy

                    </span>

                  )}

                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20} />
                    </button>

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
  title="Delete Inventory Item"
  message={
    itemToDelete
      ? `Are you sure you want to delete "${itemToDelete.name}"?`
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
import { useState } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";

import api from "../services/api";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function TablesTable({
  tables,
  loadTables,
  setSelectedTable,
  setShowEditModal,
}) {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

  async function toggleTable(table) {

    try {

      if (table.isOccupied) {

        await api.patch(`/tables/${table.id}/free`);

      } else {

        await api.patch(`/tables/${table.id}/occupy`);

      }

      loadTables();

    } catch (error) {

      console.log(error);

    }

  }

  async function deleteTable() {

    try {

      await api.delete(`/tables/${tableToDelete.id}`);

      setShowDeleteModal(false);

      setTableToDelete(null);

      loadTables();

    } catch (error) {

      console.log(error);

    }

  }

  return (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-4">Table</th>

            <th className="text-left py-4">Capacity</th>

            <th className="text-left py-4">Status</th>

            <th className="text-center py-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {tables.length === 0 ? (

            <tr>

              <td
                colSpan="4"
                className="text-center py-10 text-gray-500"
              >
                No tables found.
              </td>

            </tr>

          ) : (

            tables.map(table => (

              <tr
                key={table.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="py-5 font-semibold">

                  Table {table.tableNumber}

                </td>

                <td>

                  <div className="flex items-center gap-2">

                    <Users size={18} />

                    {table.capacity}

                  </div>

                </td>

                <td>

                  {table.isOccupied ? (

                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                      <XCircle size={16}/>

                      Occupied

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                      <CheckCircle size={16}/>

                      Available

                    </span>

                  )}

                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    {/* Edit */}

                    <button
                      onClick={() => {

                        setSelectedTable(table);

                        setShowEditModal(true);

                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >

                      <Pencil size={20}/>

                    </button>

                    {/* Occupy / Free */}

                    <button
                      onClick={() => toggleTable(table)}
                      className={
                        table.isOccupied
                          ? "text-green-600 hover:text-green-800"
                          : "text-orange-600 hover:text-orange-800"
                      }
                    >

                      {table.isOccupied
                        ? "Free"
                        : "Occupy"}

                    </button>

                    {/* Delete */}

                    <button
                      onClick={() => {

                        setTableToDelete(table);

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
        title="Delete Table"
        message={
          tableToDelete
            ? `Are you sure you want to delete Table ${tableToDelete.tableNumber}?`
            : ""
        }
        onCancel={() => {

          setShowDeleteModal(false);

          setTableToDelete(null);

        }}
        onConfirm={deleteTable}
      />

    </div>

  );

}
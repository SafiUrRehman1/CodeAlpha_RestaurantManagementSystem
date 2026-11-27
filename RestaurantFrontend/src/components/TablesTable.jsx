
import { useState } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  Armchair,
  LoaderCircle,
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
  const [busyTableId, setBusyTableId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function toggleTable(table) {
    try {
      setActionError("");
      setBusyTableId(table.id);

      if (table.isOccupied) {
        await api.patch(`/tables/${table.id}/free`);
      } else {
        await api.patch(`/tables/${table.id}/occupy`);
      }

      await loadTables();
    } catch (error) {
      console.error(error);
      setActionError(
        error.response?.data || "Unable to update table status."
      );
    } finally {
      setBusyTableId(null);
    }
  }

  async function deleteTable() {
    if (!tableToDelete) return;

    try {
      setActionError("");
      await api.delete(`/tables/${tableToDelete.id}`);
      setShowDeleteModal(false);
      setTableToDelete(null);
      await loadTables();
    } catch (error) {
      console.error(error);
      setActionError(
        error.response?.data || "Unable to delete this table."
      );
    }
  }

  function editTable(table) {
    setSelectedTable(table);
    setShowEditModal(true);
  }

  function Status({ occupied }) {
    return occupied ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
        <XCircle size={14} />
        Occupied
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={14} />
        Available
      </span>
    );
  }

  return (
    <div>
      {actionError && (
        <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-6">
          {typeof actionError === "string"
            ? actionError
            : "The requested action could not be completed."}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#EEE9E1] bg-[#FAF8F4] text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-6 py-4 font-semibold">Table</th>
              <th className="px-6 py-4 font-semibold">Capacity</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tables.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-14 text-center text-sm text-gray-500">
                  No tables found. Try changing your search or filter.
                </td>
              </tr>
            ) : (
              tables.map((table) => (
                <tr
                  key={table.id}
                  className="border-b border-[#F0ECE6] transition hover:bg-[#FAF8F4]"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#F5F0E7] p-2.5 text-[#B95F3B]">
                        <Armchair size={20} />
                      </div>
                      <span className="font-semibold text-[#25221F]">
                        Table {table.tableNumber}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <Users size={17} />
                      {table.capacity} guests
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <Status occupied={table.isOccupied} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editTable(table)}
                        title="Edit table"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-[#F5F0E7] hover:text-[#B95F3B]"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => toggleTable(table)}
                        disabled={busyTableId === table.id}
                        className={`min-w-[76px] rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                          table.isOccupied
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {busyTableId === table.id ? (
                          <LoaderCircle size={15} className="mx-auto animate-spin" />
                        ) : table.isOccupied ? (
                          "Free"
                        ) : (
                          "Occupy"
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setTableToDelete(table);
                          setShowDeleteModal(true);
                        }}
                        title="Delete table"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-4 md:hidden">
        {tables.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            No tables found. Try changing your search or filter.
          </div>
        ) : (
          tables.map((table) => (
            <div
              key={table.id}
              className="rounded-xl border border-[#EAE5DC] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#F5F0E7] p-3 text-[#B95F3B]">
                    <Armchair size={21} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#25221F]">
                      Table {table.tableNumber}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                      <Users size={15} />
                      {table.capacity} guests
                    </p>
                  </div>
                </div>
                <Status occupied={table.isOccupied} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#F0ECE6] pt-3">
                <button
                  onClick={() => editTable(table)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#F5F0E7] px-2 py-2.5 text-xs font-semibold text-[#25221F]"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  onClick={() => toggleTable(table)}
                  disabled={busyTableId === table.id}
                  className={`flex items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-xs font-semibold disabled:opacity-50 ${
                    table.isOccupied
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {busyTableId === table.id ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : table.isOccupied ? (
                    "Free"
                  ) : (
                    "Occupy"
                  )}
                </button>

                <button
                  onClick={() => {
                    setTableToDelete(table);
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-2 py-2.5 text-xs font-semibold text-red-600"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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

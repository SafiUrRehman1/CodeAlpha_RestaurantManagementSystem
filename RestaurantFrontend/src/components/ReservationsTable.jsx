
import { useState } from "react";
import {
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";

import api from "../services/api";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function ReservationsTable({
  reservations,
  loadReservations,
  setSelectedReservation,
  setShowModal,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function deleteReservation() {
    if (!reservationToDelete) return;

    try {
      setDeleting(true);

      await api.delete(`/Reservations/${reservationToDelete.id}`);
      await loadReservations();

      setShowDeleteModal(false);
      setReservationToDelete(null);
    } catch (error) {
      console.error("Failed to delete reservation:", error);
      alert(error.response?.data || "Failed to delete reservation.");
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(value) {
    if (!value) return "Date not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function StatusBadge({ status }) {
    const styles = {
      Pending: "bg-amber-50 text-amber-700 border-amber-100",
      Confirmed: "bg-blue-50 text-blue-700 border-blue-100",
      Completed: "bg-green-50 text-green-700 border-green-100",
      Cancelled: "bg-red-50 text-red-700 border-red-100",
    };

    const icons = {
      Pending: Clock,
      Confirmed: CheckCircle2,
      Completed: CheckCircle2,
      Cancelled: XCircle,
    };

    const Icon = icons[status] || Clock;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
          styles[status] || "border-gray-200 bg-gray-50 text-gray-600"
        }`}
      >
        <Icon size={14} />
        {status || "Unknown"}
      </span>
    );
  }

  function Actions({ reservation }) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setSelectedReservation(reservation);
            setShowModal(true);
          }}
          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
          title="Edit reservation"
          aria-label={`Edit reservation ${reservation.id}`}
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => {
            setReservationToDelete(reservation);
            setShowDeleteModal(true);
          }}
          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
          title="Delete reservation"
          aria-label={`Delete reservation ${reservation.id}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <>
      {reservations.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F0E7] text-[#B95F3B]">
            <CalendarDays size={27} />
          </div>

          <h3 className="font-semibold text-[#25221F]">
            No reservations found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-[#F5F0E7] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Table</th>
                  <th className="px-6 py-4 font-semibold">Reservation Time</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="transition hover:bg-[#FAF8F4]"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-[#25221F]">
                        {reservation.userName || "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Reservation #{reservation.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      Table {reservation.tableId}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {formatDate(reservation.reservationTime)}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={reservation.status} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <Actions reservation={reservation} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#25221F]">
                      {reservation.userName || "Customer"}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Reservation #{reservation.id}
                    </p>
                  </div>

                  <StatusBadge status={reservation.status} />
                </div>

                <div className="space-y-2 rounded-xl bg-[#FAF8F4] p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Table:</span>{" "}
                    {reservation.tableId}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(reservation.reservationTime)}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Actions reservation={reservation} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Reservation"
        message={
          reservationToDelete
            ? `Delete reservation for ${reservationToDelete.userName || "this customer"}?`
            : ""
        }
        onCancel={() => {
          if (deleting) return;
          setShowDeleteModal(false);
          setReservationToDelete(null);
        }}
        onConfirm={deleteReservation}
      />
    </>
  );
}

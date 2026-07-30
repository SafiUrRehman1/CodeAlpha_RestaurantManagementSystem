import {
  Pencil,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useState } from "react";
import api from "../services/api";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function ReservationsTable({
  reservations,
  loadReservations,
  setSelectedReservation,
  setShowModal,
}) {
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [reservationToDelete, setReservationToDelete] =
    useState(null);

  async function deleteReservation() {
    try {
      await api.delete(
        `/Reservations/${reservationToDelete.id}`
      );

      setShowDeleteModal(false);

      setReservationToDelete(null);

      loadReservations();
    } catch (error) {
      console.log(error);
    }
  }

  function statusBadge(status) {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
            <Clock size={16} />
            Pending
          </span>
        );

      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            <CheckCircle size={16} />
            Confirmed
          </span>
        );

      case "Completed":
        return (
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            <CheckCircle size={16} />
            Completed
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
            <XCircle size={16} />
            Cancelled
          </span>
        );
    }
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-4">
              Customer
            </th>

            <th className="text-left py-4">
              Table
            </th>

            <th className="text-left py-4">
              Reservation Time
            </th>

            <th className="text-left py-4">
              Status
            </th>

            <th className="text-center py-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {reservations.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="text-center py-10 text-gray-500"
              >
                No reservations found.
              </td>

            </tr>

          ) : (

            reservations.map((reservation) => (

              <tr
                key={reservation.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="py-5 font-semibold">
                  {reservation.userName}
                </td>

                <td>
                  Table {reservation.tableId}
                </td>

                <td>
                  {new Date(
                    reservation.reservationTime
                  ).toLocaleString()}
                </td>

                <td>
                  {statusBadge(reservation.status)}
                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => {
                        setSelectedReservation(
                          reservation
                        );

                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20} />
                    </button>

                    <button
                      onClick={() => {
                        setReservationToDelete(
                          reservation
                        );

                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
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
        title="Delete Reservation"
        message={
          reservationToDelete
            ? `Delete reservation for ${reservationToDelete.userName}?`
            : ""
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setReservationToDelete(null);
        }}
        onConfirm={deleteReservation}
      />

    </div>
  );
}
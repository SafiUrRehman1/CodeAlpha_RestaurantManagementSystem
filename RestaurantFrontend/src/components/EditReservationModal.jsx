import { useEffect, useState } from "react";
import api from "../services/api";

export default function EditReservationModal({
  isOpen,
  onClose,
  reservation,
  loadReservations,
}) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (reservation) {
      setStatus(reservation.status);
    }
  }, [reservation]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.patch(
        `/Reservations/${reservation.id}/status`,
        {
          status,
        }
      );

      await loadReservations();

      onClose();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data ||
          "Failed to update reservation."
      );
    }
  }

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          Update Reservation
        </h2>

        <div className="space-y-4 mb-6">

          <div>

            <label className="font-medium">
              Customer
            </label>

            <p className="text-gray-600">
              {reservation.userName}
            </p>

          </div>

          <div>

            <label className="font-medium">
              Table
            </label>

            <p className="text-gray-600">
              Table {reservation.tableId}
            </p>

          </div>

          <div>

            <label className="font-medium">
              Reservation Time
            </label>

            <p className="text-gray-600">
              {new Date(
                reservation.reservationTime
              ).toLocaleString()}
            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e)=>setStatus(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

          </div>

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="border rounded-xl px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3"
            >
              Update
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
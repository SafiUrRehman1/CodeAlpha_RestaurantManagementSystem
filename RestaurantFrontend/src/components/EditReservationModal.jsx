
import { useEffect, useState } from "react";
import {
  X,
  CalendarCheck,
  Clock,
  User,
  Armchair,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";

export default function EditReservationModal({
  isOpen,
  onClose,
  reservation,
  loadReservations,
}) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (reservation) {
      setStatus(reservation.status || "Pending");
      setError("");
    }
  }, [reservation]);

  if (!isOpen || !reservation) return null;

  function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.patch(`/Reservations/${reservation.id}/status`, {
        status,
      });

      await loadReservations();
      onClose();
    } catch (err) {
      console.error("Failed to update reservation:", err);
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to update reservation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5">
      <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-8">

        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-[#B95F3B]">
              <CalendarCheck size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#25221F] sm:text-2xl">
                Update Reservation
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Reservation #{reservation.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {error && (
          <div className="mb-5 flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="mb-6 space-y-4 rounded-xl bg-[#FAF8F4] p-4">
          <div className="flex items-start gap-3">
            <User size={18} className="mt-0.5 shrink-0 text-[#B95F3B]" />
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="mt-1 text-sm font-semibold text-[#25221F]">
                {reservation.userName || "Customer"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Armchair size={18} className="mt-0.5 shrink-0 text-[#B95F3B]" />
            <div>
              <p className="text-xs text-gray-500">Table</p>
              <p className="mt-1 text-sm font-semibold text-[#25221F]">
                Table {reservation.tableId}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={18} className="mt-0.5 shrink-0 text-[#B95F3B]" />
            <div>
              <p className="text-xs text-gray-500">Reservation Time</p>
              <p className="mt-1 text-sm font-semibold text-[#25221F]">
                {formatDate(reservation.reservationTime)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Reservation Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !status}
              className="rounded-xl bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

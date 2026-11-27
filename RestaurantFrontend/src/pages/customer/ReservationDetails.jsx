
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Armchair,
  Hash,
  ArrowLeft,
  CalendarCheck,
  XCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadReservation();
  }, [id]);

  async function loadReservation() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get(
        `/reservations/my-reservations/${id}`
      );

      setReservation(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Unable to load reservation.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const response = await api.delete(
        `/reservations/my-reservations/${reservation.id}`
      );

      toast.success(
        response.data?.message || "Reservation cancelled successfully."
      );

      navigate("/customer/my-reservations");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data || "Unable to cancel reservation."
      );
    } finally {
      setCancelling(false);
    }
  }

  function getStatusStyle(status) {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800";

      case "confirmed":
        return "bg-green-100 text-green-800";

      case "completed":
        return "bg-blue-100 text-blue-800";

      case "cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Date unavailable";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-PK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(dateString) {
    if (!dateString) return "Time unavailable";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "Time unavailable";

    return date.toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F5F0E7]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8E0D5] border-t-[#B95F3B]" />
          <p className="mt-4 text-sm text-[#77716A]">
            Loading reservation details...
          </p>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !reservation) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[60vh] items-center justify-center bg-[#F5F0E7] px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E8E0D5] bg-white p-8 text-center">
            <AlertCircle size={40} className="mx-auto text-red-500" />

            <h2 className="mt-4 font-serif text-2xl font-bold text-[#25221F]">
              Reservation not found
            </h2>

            <p className="mt-2 text-sm text-[#77716A]">
              We couldn't retrieve this reservation. It may no longer be available.
            </p>

            <Link
              to="/customer/my-reservations"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25221F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#403A34]"
            >
              <ArrowLeft size={17} />
              Back to Reservations
            </Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#F5F0E7] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">

          {/* Back Navigation */}
          <Link
            to="/customer/my-reservations"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#77716A] transition hover:text-[#B95F3B]"
          >
            <ArrowLeft size={17} />
            Back to My Reservations
          </Link>

          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B95F3B]">
              Your booking information
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Reservation Details
            </h1>

            <p className="mt-2 text-sm text-[#77716A]">
              Review the details of your restaurant reservation.
            </p>
          </div>

          {/* Reservation Card */}
          <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">

            {/* Card Header */}
            <div className="flex flex-col gap-4 border-b border-[#EEE8DF] bg-[#FCFAF7] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#999087]">
                  Reservation Number
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#25221F]">
                  #{reservation.id}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                  reservation.status
                )}`}
              >
                {reservation.status || "Unknown"}
              </span>
            </div>

            {/* Booking Information */}
            <div className="px-5 py-7 sm:px-8 sm:py-9">
              <div className="mb-7">
                <h3 className="text-lg font-bold text-[#25221F]">
                  Booking Information
                </h3>

                <p className="mt-1 text-sm text-[#999087]">
                  Your selected table and reservation schedule.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Reservation ID */}
                <div className="rounded-xl bg-[#F9F6F0] p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                    <Hash size={21} className="text-[#B95F3B]" />
                  </div>

                  <p className="text-xs text-[#999087]">
                    Reservation ID
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#25221F]">
                    #{reservation.id}
                  </p>
                </div>

                {/* Table */}
                <div className="rounded-xl bg-[#F9F6F0] p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                    <Armchair size={21} className="text-[#B95F3B]" />
                  </div>

                  <p className="text-xs text-[#999087]">
                    Table Number
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#25221F]">
                    Table {reservation.tableNumber ?? reservation.tableId ?? "N/A"}
                  </p>
                </div>

                {/* Date */}
                <div className="rounded-xl bg-[#F9F6F0] p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                    <CalendarDays size={21} className="text-[#B95F3B]" />
                  </div>

                  <p className="text-xs text-[#999087]">
                    Reservation Date
                  </p>

                  <p className="mt-1 text-base font-semibold text-[#25221F]">
                    {formatDate(reservation.reservationTime)}
                  </p>
                </div>

                {/* Time */}
                <div className="rounded-xl bg-[#F9F6F0] p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                    <Clock size={21} className="text-[#B95F3B]" />
                  </div>

                  <p className="text-xs text-[#999087]">
                    Reservation Time
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#25221F]">
                    {formatTime(reservation.reservationTime)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#EEE8DF] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/customer/my-reservations"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D9D0C5] px-5 py-3 text-sm font-semibold text-[#25221F] transition hover:bg-[#F9F6F0]"
                >
                  <ArrowLeft size={17} />
                  All Reservations
                </Link>

                {reservation.status?.toLowerCase() === "pending" && (
                  <button
                    onClick={cancelReservation}
                    disabled={cancelling}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={17} />
                    {cancelling ? "Cancelling..." : "Cancel Reservation"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Information Note */}
          <div className="mt-5 flex gap-3 rounded-xl border border-[#E8E0D5] bg-white p-4">
            <CalendarCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#B95F3B]"
            />

            <p className="text-sm leading-6 text-[#77716A]">
              Your reservation status is managed by the restaurant.
              If you need assistance, please contact the restaurant directly.
            </p>
          </div>

        </div>
      </div>
    </CustomerLayout>
  );
}

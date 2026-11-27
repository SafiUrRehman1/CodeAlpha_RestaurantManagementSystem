
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Hash,
  Armchair,
  ArrowRight,
  Plus,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/reservations/my-reservations");
      setReservations(response.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Unable to load your reservations.");
    } finally {
      setLoading(false);
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

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#F5F0E7] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">

          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B95F3B]">
                Your dining plans
              </p>

              <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
                My Reservations
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#77716A] sm:text-base">
                Keep track of your upcoming restaurant visits.
              </p>
            </div>

            <Link
              to="/customer/reserve-table"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D] sm:w-auto"
            >
              <Plus size={18} />
              Reserve a Table
            </Link>
          </div>

          {/* Reservation Count */}
          {!loading && !error && reservations.length > 0 && (
            <div className="mb-6 flex items-center gap-2 text-sm text-[#77716A]">
              <CalendarCheck size={18} className="text-[#B95F3B]" />
              You have {reservations.length} reservation
              {reservations.length !== 1 ? "s" : ""}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-[#E8E0D5] bg-white px-5 py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8E0D5] border-t-[#B95F3B]" />
              <p className="mt-4 text-sm text-[#77716A]">
                Loading your reservations...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-14 text-center">
              <AlertCircle size={38} className="mx-auto text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-[#25221F]">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-[#77716A]">
                We couldn't retrieve your reservations.
              </p>
              <button
                onClick={loadReservations}
                className="mt-6 rounded-lg bg-[#25221F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#403A34]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && reservations.length === 0 && (
            <div className="rounded-2xl border border-[#E8E0D5] bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E7]">
                <CalendarDays size={30} className="text-[#B95F3B]" />
              </div>

              <h2 className="mt-5 font-serif text-2xl font-bold text-[#25221F]">
                No reservations yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#77716A]">
                You haven't booked a table yet. Make a reservation and
                we'll keep your dining plans organized here.
              </p>

              <Link
                to="/customer/reserve-table"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#B95F3B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D]"
              >
                Book Your Table
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {/* Reservation Cards */}
          {!loading && !error && reservations.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[#EEE8DF] px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#999087]">
                        Reservation
                      </p>
                      <p className="mt-1 font-semibold text-[#25221F]">
                        #{reservation.id}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                        reservation.status
                      )}`}
                    >
                      {reservation.status || "Unknown"}
                    </span>
                  </div>

                  <div className="space-y-5 px-5 py-6 sm:px-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E7]">
                        <CalendarDays size={21} className="text-[#B95F3B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#999087]">Reservation Date</p>
                        <p className="mt-1 text-sm font-semibold text-[#25221F]">
                          {formatDate(reservation.reservationTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E7]">
                        <Clock size={21} className="text-[#B95F3B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#999087]">Reservation Time</p>
                        <p className="mt-1 text-sm font-semibold text-[#25221F]">
                          {formatTime(reservation.reservationTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E7]">
                        <Armchair size={21} className="text-[#B95F3B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#999087]">Table ID</p>
                        <p className="mt-1 text-sm font-semibold text-[#25221F]">
                          Table #{reservation.tableId}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#EEE8DF] pt-4">
                      <Link
                        to={`/customer/my-reservations/${reservation.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#984A2D] sm:w-auto"                      >
                        View Details
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </CustomerLayout>
  );
}

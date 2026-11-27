
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import ReservationsTable from "../../components/ReservationsTable";
import EditReservationModal from "../../components/EditReservationModal";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReservations() {
    try {
      setError("");
      const response = await api.get("/Reservations/admin");
      setReservations(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Failed to load reservations:", err);
      setError("Unable to load reservations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  const stats = useMemo(() => ({
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "Pending").length,
    confirmed: reservations.filter((r) => r.status === "Confirmed").length,
    completed: reservations.filter((r) => r.status === "Completed").length,
    cancelled: reservations.filter((r) => r.status === "Cancelled").length,
  }), [reservations]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const customerName = (reservation.userName || "").toLowerCase();
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        customerName.includes(searchTerm) ||
        String(reservation.id).includes(searchTerm) ||
        String(reservation.tableId).includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  const statCards = [
    {
      label: "Total Reservations",
      value: stats.total,
      icon: CalendarDays,
      color: "text-[#B95F3B]",
      bg: "bg-orange-50",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#B95F3B]">
              <CalendarDays size={18} />
              Restaurant Management
            </div>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Reservations
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage bookings, confirm tables, and track reservation status.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              loadReservations();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#25221F] transition hover:bg-[#F5F0E7] sm:w-auto"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold text-[#25221F]">
                      {card.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reservations List */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#25221F]">
              All Reservations
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search bookings and update their reservation status.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={19}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search customer, reservation ID, or table..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAF8F4] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                />
              </div>

              <div className="relative sm:w-52">
                <SlidersHorizontal
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-[#FAF8F4] py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-[#B95F3B]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
              <p className="text-sm text-gray-600">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  loadReservations();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#B95F3B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#984A2D]"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#B95F3B] border-t-transparent" />
              Loading reservations...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-[#25221F]">
                    {filteredReservations.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#25221F]">
                    {reservations.length}
                  </span>{" "}
                  reservations
                </p>

                {(search || statusFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                    }}
                    className="text-sm font-semibold text-[#B95F3B] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <ReservationsTable
                reservations={filteredReservations}
                loadReservations={loadReservations}
                setSelectedReservation={setSelectedReservation}
                setShowModal={setShowModal}
              />
            </>
          )}
        </section>
      </div>

      <EditReservationModal
        isOpen={showModal}
        reservation={selectedReservation}
        loadReservations={loadReservations}
        onClose={() => setShowModal(false)}
      />
    </AdminLayout>
  );
}

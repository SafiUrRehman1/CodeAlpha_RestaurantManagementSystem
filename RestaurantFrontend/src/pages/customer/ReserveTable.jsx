
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  Users,
  Utensils,
  ArrowRight,
  Armchair,
} from "lucide-react";

import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function ReserveTable() {
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    try {
      const response = await api.get("/tables/available");
      setTables(response.data || []);
    } catch (error) {
      console.error("Unable to load tables:", error);
      toast.error("Unable to load available tables.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve(e) {
    e.preventDefault();

    if (!tableId || !date || !time) {
      toast.error("Please complete all fields.");
      return;
    }

    const reservationDateTime = new Date(`${date}T${time}`);

    if (reservationDateTime <= new Date()) {
      toast.error("Please select a future date and time.");
      return;
    }

    try {
      setSubmitting(true);

      const reservationTime = `${date}T${time}:00`;

      await api.post("/reservations", {
        tableId: Number(tableId),
        reservationTime,
      });

      toast.success("Reservation created successfully.");
      navigate("/customer/my-reservations");
    } catch (error) {
      console.error("Reservation failed:", error);

      toast.error(
        error.response?.data || "Reservation failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CustomerLayout>
      <main className="min-h-screen bg-[#F5F0E7] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-9 text-center sm:mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#B95F3B]">
              Your dining experience
            </p>

            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#25221F] sm:text-4xl md:text-5xl">
              Reserve Your Table
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77716A] sm:text-base">
              Plan your next visit with us. Choose your preferred table,
              date, and time to make a reservation.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">

            {/* Left Information Panel */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#25221F] p-6 text-white sm:p-8">
              <div>
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B95F3B]">
                  <Utensils size={27} />
                </div>

                <h2 className="font-['Playfair_Display'] text-2xl font-bold sm:text-3xl">
                  A table waiting for you.
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#D1C8BC]">
                  Enjoy delicious food and a welcoming atmosphere.
                  Make your reservation in just a few simple steps.
                </p>
              </div>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/10 p-3">
                    <Armchair size={20} className="text-[#E6A184]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Choose your table</h3>
                    <p className="mt-1 text-sm text-[#BDB4A9]">
                      Select from the available tables.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/10 p-3">
                    <CalendarDays size={20} className="text-[#E6A184]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pick your date</h3>
                    <p className="mt-1 text-sm text-[#BDB4A9]">
                      Select a suitable date for your visit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/10 p-3">
                    <Clock size={20} className="text-[#E6A184]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Choose your time</h3>
                    <p className="mt-1 text-sm text-[#BDB4A9]">
                      Select your preferred reservation time.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-10 border-t border-white/10 pt-5 text-xs text-[#BDB4A9]">
                Your reservation will be submitted for processing.
              </p>
            </div>

            {/* Reservation Form */}
            <div className="rounded-2xl border border-[#E8DFD3] bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-7">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#25221F]">
                  Reservation Details
                </h2>
                <p className="mt-2 text-sm text-[#77716A]">
                  Complete the information below.
                </p>
              </div>

              <form onSubmit={handleReserve} className="space-y-6">

                {/* Table Selection */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#39332D]">
                    <Armchair size={17} className="text-[#B95F3B]" />
                    Select Available Table
                  </label>

                  <select
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                    disabled={loading || tables.length === 0}
                    required
                    className="w-full rounded-xl border border-[#DED5C9] bg-[#FAF8F4] px-4 py-3.5 text-sm text-[#25221F] outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {loading
                        ? "Loading available tables..."
                        : tables.length === 0
                        ? "No available tables"
                        : "Choose a table"}
                    </option>

                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        Table {table.tableNumber} — {table.capacity} Persons
                      </option>
                    ))}
                  </select>

                  {!loading && tables.length === 0 && (
                    <p className="mt-2 text-xs text-red-500">
                      No tables are currently available.
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#39332D]">
                    <CalendarDays size={17} className="text-[#B95F3B]" />
                    Reservation Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    min={minDate}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#DED5C9] bg-[#FAF8F4] px-4 py-3.5 text-sm text-[#25221F] outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/15"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#39332D]">
                    <Clock size={17} className="text-[#B95F3B]" />
                    Reservation Time
                  </label>

                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#DED5C9] bg-[#FAF8F4] px-4 py-3.5 text-sm text-[#25221F] outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/15"
                  />
                </div>

                {/* Selected Table Preview */}
                {tableId && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#E8DFD3] bg-[#FAF7F1] p-4">
                    <div className="rounded-lg bg-white p-3">
                      <Users size={21} className="text-[#B95F3B]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#77716A]">
                        Selected Table
                      </p>
                      <p className="font-semibold text-[#25221F]">
                        {(() => {
                          const selected = tables.find(
                            (table) => String(table.id) === tableId
                          );
                          return selected
                            ? `Table ${selected.tableNumber} · ${selected.capacity} Persons`
                            : "Selected table";
                        })()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || loading || tables.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B95F3B] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#984A2D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating Reservation..." : "Reserve My Table"}
                  {!submitting && <ArrowRight size={18} />}
                </button>

                <p className="text-center text-xs leading-5 text-[#999087]">
                  You can view your reservation after submitting it.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </CustomerLayout>
  );
}

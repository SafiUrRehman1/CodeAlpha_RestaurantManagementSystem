
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Table2,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import TablesTable from "../../components/TablesTable";
import AddTableModal from "../../components/AddTableModal";
import EditTableModal from "../../components/EditTableModal";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTables() {
    try {
      setError("");
      const response = await api.get("/tables");
      setTables(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load restaurant tables. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTables();
  }, []);

  const totalTables = tables.length;
  const occupiedTables = tables.filter((table) => table.isOccupied).length;
  const availableTables = totalTables - occupiedTables;

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSearch = String(table.tableNumber)
        .includes(search.trim());

      const matchesFilter =
        filter === "all" ||
        (filter === "occupied" && table.isOccupied) ||
        (filter === "available" && !table.isOccupied);

      return matchesSearch && matchesFilter;
    });
  }, [tables, search, filter]);

  const stats = [
    {
      label: "Total Tables",
      value: totalTables,
      icon: Table2,
      color: "text-[#B95F3B]",
      bg: "bg-[#B95F3B]/10",
    },
    {
      label: "Available",
      value: availableTables,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Occupied",
      value: occupiedTables,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#B95F3B]">
              <Table2 size={17} />
              Restaurant Management
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Restaurant Tables
            </h1>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage table availability, seating capacity, and occupancy.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#B95F3B] px-5 py-3 font-semibold text-white transition hover:bg-[#984A2D] sm:w-auto"
          >
            <Plus size={19} />
            Add Table
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-[#25221F]">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <Icon size={23} className={stat.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white shadow-sm">
          <div className="border-b border-[#EEE9E1] p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#25221F]">
                  All Tables
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredTables.length} of {totalTables} tables
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-64">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search table number..."
                    className="w-full rounded-xl border border-[#E5DED3] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                  />
                </div>

                <div className="relative">
                  <SlidersHorizontal
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E5DED3] bg-white py-3 pl-10 pr-9 text-sm outline-none focus:border-[#B95F3B] sm:w-44"
                  >
                    <option value="all">All tables</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>

                <button
                  onClick={loadTables}
                  title="Refresh tables"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DED3] px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#F5F0E7]"
                >
                  <RefreshCw size={17} />
                  <span className="sm:hidden">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:m-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <AlertCircle size={18} />
                {error}
              </div>
              <button
                onClick={loadTables}
                className="text-left text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
              <RefreshCw size={20} className="animate-spin" />
              Loading tables...
            </div>
          ) : !error ? (
            <TablesTable
              tables={filteredTables}
              loadTables={loadTables}
              setSelectedTable={setSelectedTable}
              setShowEditModal={setShowEditModal}
            />
          ) : null}
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-[#EAE5DC] bg-[#F5F0E7]/60 p-4">
          <Users size={19} className="mt-0.5 shrink-0 text-[#B95F3B]" />
          <p className="text-sm leading-6 text-gray-600">
            Table capacity represents the maximum number of guests that can be
            seated. Mark a table as occupied or available to keep its status
            up to date.
          </p>
        </div>
      </div>

      <AddTableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        loadTables={loadTables}
      />

      <EditTableModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        table={selectedTable}
        loadTables={loadTables}
      />
    </AdminLayout>
  );
}

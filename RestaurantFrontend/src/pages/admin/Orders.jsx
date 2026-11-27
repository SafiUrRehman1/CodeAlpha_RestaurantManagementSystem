
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  RefreshCcw,
  Clock3,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import OrdersTable from "../../components/OrdersTable";
import EditOrderModal from "../../components/EditOrderModal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/orders");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Unable to load orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Order statistics
  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparingCount = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const readyCount = orders.filter(
    (order) => order.status === "Ready"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  // Search and status filtering
  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      !searchTerm ||
      order.customerName?.toLowerCase().includes(searchTerm) ||
      String(order.id).includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statistics = [
    {
      title: "Pending Orders",
      value: pendingCount,
      icon: Clock3,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      accent: "border-amber-400",
    },
    {
      title: "Preparing",
      value: preparingCount,
      icon: ChefHat,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      accent: "border-blue-400",
    },
    {
      title: "Ready",
      value: readyCount,
      icon: PackageCheck,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      accent: "border-purple-400",
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      accent: "border-green-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-7">

        {/* Page Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#B95F3B]">
              Restaurant Operations
            </p>

            <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              <ShoppingCart
                size={30}
                className="shrink-0 text-[#B95F3B]"
              />
              Orders Management
            </h1>

            <p className="mt-2 text-sm text-[#77716A]">
              Monitor customer orders and manage their progress.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25221F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#403A34] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Refreshing..." : "Refresh Orders"}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`rounded-2xl border border-[#E8E0D5] border-l-4 ${stat.accent} bg-white p-5 shadow-sm`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#77716A]">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tabular-nums text-[#25221F]">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon size={23} className={stat.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order List */}
        <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b border-[#EEE8DF] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#25221F]">
                  All Orders
                </h2>

                <p className="mt-1 text-sm text-[#999087]">
                  Search and filter restaurant orders.
                </p>
              </div>

              {!loading && !error && (
                <span className="w-fit rounded-full bg-[#F5F0E7] px-3 py-1.5 text-xs font-semibold text-[#66594F]">
                  {filteredOrders.length} of {orders.length} orders
                </span>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 gap-4 border-b border-[#EEE8DF] bg-[#FCFAF7] p-5 sm:grid-cols-2 sm:p-6">

            <div>
              <label
                htmlFor="order-search"
                className="mb-2 block text-xs font-semibold text-[#77716A]"
              >
                Search Orders
              </label>

              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69D92]"
                />

                <input
                  id="order-search"
                  type="search"
                  placeholder="Search customer or order ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DED4] bg-white py-3 pl-11 pr-4 text-sm text-[#25221F] outline-none transition placeholder:text-[#AAA198] focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="order-status"
                className="mb-2 block text-xs font-semibold text-[#77716A]"
              >
                Filter by Status
              </label>

              <div className="relative">
                <SlidersHorizontal
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69D92]"
                />

                <select
                  id="order-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E5DED4] bg-white py-3 pl-11 pr-4 text-sm text-[#25221F] outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                >
                  <option value="All">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8E0D5] border-t-[#B95F3B]" />

              <p className="mt-4 text-sm text-[#77716A]">
                Loading orders...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-5 py-16 text-center">
              <AlertCircle
                size={38}
                className="mx-auto text-red-500"
              />

              <h3 className="mt-4 text-lg font-bold text-[#25221F]">
                Unable to load orders
              </h3>

              <p className="mt-2 text-sm text-[#77716A]">
                Something went wrong while retrieving the orders.
              </p>

              <button
                type="button"
                onClick={loadOrders}
                className="mt-5 rounded-lg bg-[#B95F3B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty Results */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="px-5 py-16 text-center">
              <ShoppingCart
                size={38}
                className="mx-auto text-[#B9AEA1]"
              />

              <h3 className="mt-4 text-lg font-bold text-[#25221F]">
                No orders found
              </h3>

              <p className="mt-2 text-sm text-[#77716A]">
                {orders.length === 0
                  ? "There are no customer orders yet."
                  : "Try changing your search or status filter."}
              </p>

              {(search || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-5 text-sm font-semibold text-[#B95F3B] hover:text-[#984A2D]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Existing Orders Table */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="overflow-x-auto p-4 sm:p-6">
              <OrdersTable
                orders={filteredOrders}
                loadOrders={loadOrders}
                setSelectedOrder={setSelectedOrder}
                setShowModal={setShowModal}
              />
            </div>
          )}
        </div>

        {/* Existing Edit Modal */}
        <EditOrderModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          order={selectedOrder}
          loadOrders={loadOrders}
        />

      </div>
    </AdminLayout>
  );
}

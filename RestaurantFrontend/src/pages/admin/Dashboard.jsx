
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  DollarSign,
  CalendarDays,
  TriangleAlert,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Package,
  UtensilsCrossed,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    setDashboardError(false);

    const results = await Promise.allSettled([
      api.get("/admin/dashboard"),
      api.get("/admin/recent-orders"),
      api.get("/admin/low-stock"),
      api.get("/admin/top-selling-items"),
    ]);

    if (results[0].status === "fulfilled") {
      setDashboard(results[0].value.data);
    } else {
      console.error(results[0].reason);
      setDashboardError(true);
    }

    if (results[1].status === "fulfilled") {
      setRecentOrders(results[1].value.data || []);
    } else {
      console.error(results[1].reason);
    }

    if (results[2].status === "fulfilled") {
      setLowStockItems(results[2].value.data || []);
    } else {
      console.error(results[2].reason);
    }

    if (results[3].status === "fulfilled") {
      setTopSellingItems(results[3].value.data || []);
    } else {
      console.error(results[3].reason);
    }

    setLoading(false);
  }

  function formatCurrency(amount) {
    return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const summaryCards = [
    {
      title: "Total Customers",
      value: dashboard?.totalCustomers ?? "—",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: "Registered customers",
    },
    {
      title: "Total Orders",
      value: dashboard?.totalOrders ?? "—",
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
      description: "Orders received",
    },
    {
      title: "Total Revenue",
      value:
        dashboard?.totalRevenue != null
          ? formatCurrency(dashboard.totalRevenue)
          : "—",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      description: "Recorded revenue",
    },
    {
      title: "Reservations",
      value: dashboard?.totalReservations ?? "—",
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-600",
      description: "Total reservations",
    },
    {
      title: "Low Stock Items",
      value: dashboard?.lowStockItems ?? "—",
      icon: TriangleAlert,
      color: "bg-red-50 text-red-600",
      description: "Items needing attention",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Dashboard Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B95F3B]">
              Overview
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#77716A]">
              Monitor your restaurant's performance and daily operations.
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D9D0C5] bg-white px-4 py-3 text-sm font-semibold text-[#25221F] transition hover:bg-[#F9F6F0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#25221F]">
              Business Overview
            </h2>
            <TrendingUp size={20} className="text-[#B95F3B]" />
          </div>

          {dashboardError && (
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-100 bg-white p-4 sm:flex-row sm:items-center">
              <AlertCircle size={20} className="shrink-0 text-red-500" />
              <p className="text-sm text-[#77716A]">
                Unable to load summary statistics. Other dashboard sections
                may still be available.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[#E8E0D5] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#77716A]">
                        {card.title}
                      </p>

                      <h3 className="mt-3 break-words text-2xl font-bold text-[#25221F] sm:text-3xl">
                        {loading ? "..." : card.value}
                      </h3>

                      <p className="mt-2 text-xs text-[#A69D92]">
                        {card.description}
                      </p>
                    </div>

                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
                      <Icon size={23} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Orders */}
        <section className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#EEE8DF] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#25221F]">
                Recent Orders
              </h2>
              <p className="mt-1 text-sm text-[#999087]">
                Latest customer orders.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#B95F3B] transition hover:text-[#984A2D]"
            >
              View All Orders
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-[#999087]">
              Loading recent orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-10 text-center">
              <ShoppingCart size={32} className="mx-auto text-[#C9BFB3]" />
              <p className="mt-3 text-sm text-[#77716A]">
                No recent orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left">
                <thead className="bg-[#F9F6F0]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#77716A]">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#77716A]">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#77716A]">
                      Order Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEE8DF]">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="transition hover:bg-[#FCFAF7]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#25221F]">
                          {order.customerEmail || "Unknown customer"}
                        </p>
                        <p className="mt-1 text-xs text-[#999087]">
                          Order #{order.orderId}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-[#25221F]">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#77716A]">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Inventory and Top Selling */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Low Stock */}
          <section className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EEE8DF] p-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Package size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-[#25221F]">
                    Low Stock Items
                  </h2>
                  <p className="mt-1 text-xs text-[#999087]">
                    Inventory requiring attention
                  </p>
                </div>
              </div>

              <Link
                to="/admin/inventory"
                className="text-sm font-semibold text-[#B95F3B] hover:text-[#984A2D]"
              >
                Manage
              </Link>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-[#999087]">
                Loading inventory...
              </div>
            ) : lowStockItems.length === 0 ? (
              <div className="p-10 text-center">
                <Package size={32} className="mx-auto text-[#C9BFB3]" />
                <p className="mt-3 text-sm text-[#77716A]">
                  No low stock items.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EEE8DF]">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F0E7] text-[#B95F3B]">
                        <Package size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#25221F]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[#999087]">
                          Minimum: {item.minimumStock}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-red-600">
                        {item.quantity}
                      </p>
                      <p className="text-xs text-[#999087]">
                        Remaining
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Top Selling */}
          <section className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEE8DF] p-5 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E7] text-[#B95F3B]">
                <UtensilsCrossed size={20} />
              </div>

              <div>
                <h2 className="font-bold text-[#25221F]">
                  Top Selling Items
                </h2>
                <p className="mt-1 text-xs text-[#999087]">
                  Best-selling menu items
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-[#999087]">
                Loading sales data...
              </div>
            ) : topSellingItems.length === 0 ? (
              <div className="p-10 text-center">
                <UtensilsCrossed size={32} className="mx-auto text-[#C9BFB3]" />
                <p className="mt-3 text-sm text-[#77716A]">
                  No sales data available yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EEE8DF]">
                {topSellingItems.map((item, index) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F0E7] text-sm font-bold text-[#B95F3B]">
                        {index + 1}
                      </div>

                      <p className="truncate text-sm font-semibold text-[#25221F]">
                        {item.menuItemName}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-green-700">
                        {item.totalSold}
                      </p>
                      <p className="text-xs text-[#999087]">
                        Sold
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

      </div>
    </AdminLayout>
  );
}

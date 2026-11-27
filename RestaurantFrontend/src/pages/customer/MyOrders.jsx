
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ArrowRight,
  ShoppingBag,
  CalendarDays,
  Receipt,
} from "lucide-react";

import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setError("");
      const response = await api.get("/orders/my-orders");
      setOrders(response.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("We couldn't load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getStatusStyle(status) {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Preparing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Ready":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <CustomerLayout>
      <main className="min-h-screen bg-[#F5F0E7] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">

          {/* Page Header */}
          <div className="mb-8 sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#B95F3B]">
              Your experience
            </p>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#25221F] sm:text-4xl">
                  My Orders
                </h1>
                <p className="mt-2 text-sm text-[#77716A] sm:text-base">
                  Keep track of your restaurant orders.
                </p>
              </div>

              {!loading && !error && orders.length > 0 && (
                <div className="flex w-fit items-center gap-2 rounded-full border border-[#E5DCCF] bg-white px-4 py-2 text-sm text-[#625B53]">
                  <Package size={17} className="text-[#B95F3B]" />
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </div>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-[#E8DFD3] bg-white px-5 py-16 text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#E8DFD3] border-t-[#B95F3B]" />
              <p className="text-sm text-[#77716A]">Loading your orders...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center">
              <p className="mb-4 text-red-600">{error}</p>
              <button
                onClick={loadOrders}
                className="rounded-lg bg-[#25221F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#403A34]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="rounded-2xl border border-[#E8DFD3] bg-white px-5 py-16 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F0E7]">
                <ShoppingBag size={34} className="text-[#B95F3B]" />
              </div>

              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#25221F]">
                No orders yet
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77716A]">
                You haven't placed an order yet. Explore our menu and find something you'll enjoy.
              </p>

              <Link
                to="/customer/menu"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#B95F3B] px-6 py-3 font-semibold text-white transition hover:bg-[#984A2D]"
              >
                Explore Menu
                <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-[#E8DFD3] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Order Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E7]">
                          <Receipt size={21} className="text-[#B95F3B]" />
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-[#999087]">
                            Order Number
                          </p>
                          <h2 className="text-lg font-bold text-[#25221F]">
                            #{order.id}
                          </h2>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-7">
                        <div className="flex items-center gap-2 text-sm text-[#77716A]">
                          <CalendarDays size={16} className="shrink-0 text-[#B95F3B]" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>

                        <div className="text-sm font-semibold text-[#B95F3B]">
                          Rs. {Number(order.totalAmount).toLocaleString("en-PK")}
                        </div>
                      </div>
                    </div>

                    {/* Status and Action */}
                    <div className="flex flex-col items-start gap-4 border-t border-[#EEE8DF] pt-4 sm:items-end sm:border-0 sm:pt-0">
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <Link
                        to={`/customer/my-orders/${order.id}`}
className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#984A2D] sm:w-auto"                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </main>
    </CustomerLayout>
  );
}

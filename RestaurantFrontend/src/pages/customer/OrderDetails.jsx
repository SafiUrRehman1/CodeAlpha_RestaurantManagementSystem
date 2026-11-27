
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  Receipt,
  Utensils,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/my-orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error("Failed to load order:", err);
      setError("We couldn't load this order. Please try again.");
      setOrder(null);
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

  if (loading) {
    return (
      <CustomerLayout>
        <main className="min-h-screen bg-[#F5F0E7] px-4 py-16">
          <div className="mx-auto max-w-5xl rounded-2xl bg-white px-5 py-16 text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#E8DFD3] border-t-[#B95F3B]" />
            <p className="text-sm text-[#77716A]">
              Loading order details...
            </p>
          </div>
        </main>
      </CustomerLayout>
    );
  }

  if (error || !order) {
    return (
      <CustomerLayout>
        <main className="min-h-screen bg-[#F5F0E7] px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#E8DFD3] bg-white px-5 py-14 text-center">
            <AlertCircle size={42} className="mx-auto mb-4 text-[#B95F3B]" />

            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#25221F]">
              Order not found
            </h1>

            <p className="mt-3 text-sm text-[#77716A]">
              {error || "We couldn't find the requested order."}
            </p>

            <button
              onClick={loadOrder}
              className="mt-6 rounded-lg bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D]"
            >
              Try Again
            </button>

            <div>
              <Link
                to="/customer/my-orders"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#B95F3B] hover:underline"
              >
                <ArrowLeft size={16} />
                Back to My Orders
              </Link>
            </div>
          </div>
        </main>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <main className="min-h-screen bg-[#F5F0E7] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">

          {/* Back Navigation */}
          <Link
            to="/customer/my-orders"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#B95F3B] transition hover:text-[#984A2D]"
          >
            <ArrowLeft size={18} />
            Back to My Orders
          </Link>

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#B95F3B]">
                Order information
              </p>

              <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#25221F] sm:text-4xl">
                Order #{order.id}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-[#77716A]">
                <CalendarDays size={16} className="text-[#B95F3B]" />
                {formatDate(order.createdAt)}
              </div>
            </div>

            <span
              className={`w-fit rounded-full border px-5 py-2 text-sm font-semibold ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Order Items */}
          <section className="overflow-hidden rounded-2xl border border-[#E8DFD3] bg-white shadow-sm">
            <div className="border-b border-[#EEE8DF] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E7]">
                  <ShoppingBag size={21} className="text-[#B95F3B]" />
                </div>

                <div>
                  <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#25221F]">
                    Ordered Items
                  </h2>
                  <p className="mt-1 text-xs text-[#999087]">
                    Items included in this order
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#EEE8DF] px-5 sm:px-7">
              {order.items?.map((item, index) => (
                <div
                  key={item.menuItemId ?? index}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E7]">
                      <Utensils size={20} className="text-[#B95F3B]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-[#25221F]">
                        {item.menuItemName}
                      </h3>

                      <p className="mt-1 text-sm text-[#77716A]">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-sm text-[#77716A]">
                      Rs. {Number(item.price).toLocaleString("en-PK")}
                    </p>

                    <p className="font-bold text-[#B95F3B]">
                      Rs. {Number(item.subtotal).toLocaleString("en-PK")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-[#FAF7F1] px-5 py-6 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#77716A]">
                    <Receipt size={17} />
                    Total Amount
                  </div>
                  <p className="mt-1 text-xs text-[#999087]">
                    Final order total
                  </p>
                </div>

                <p className="text-2xl font-bold text-[#B95F3B] sm:text-3xl">
                  Rs. {Number(order.totalAmount).toLocaleString("en-PK")}
                </p>
              </div>
            </div>
          </section>

          {/* Bottom Navigation */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              to="/customer/my-orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D9CFC1] bg-white px-5 py-3 text-sm font-semibold text-[#514A42] transition hover:bg-[#EEE8DF]"
            >
              <ArrowLeft size={17} />
              All Orders
            </Link>

            <Link
              to="/customer/menu"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#984A2D]"
            >
              <Package size={17} />
              Order Again
            </Link>
          </div>
        </div>
      </main>
    </CustomerLayout>
  );
}


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Mail,
  CalendarDays,
  Package,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Preparing: "bg-blue-50 text-blue-700 border-blue-200",
  Ready: "bg-purple-50 text-purple-700 border-purple-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatPrice = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error("Failed to load order:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load this order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#B95F3B] border-t-transparent" />
            <p className="mt-4 text-sm text-gray-500">Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#B95F3B]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={36} />
            <h2 className="text-xl font-semibold text-[#25221F]">
              Order unavailable
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {error || "The requested order could not be found."}
            </p>

            <button
              onClick={loadOrder}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#984A2D]"
            >
              <RefreshCcw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const items = order.items || [];
  const statusClass =
    statusStyles[order.status] ||
    "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#B95F3B]"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </button>

            <h1 className="font-serif text-3xl font-bold text-[#25221F]">
              Order #{order.id}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review the customer's order and purchased items
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusClass}`}
          >
            {order.status}
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-[#B95F3B]">
                <ShoppingBag size={21} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="text-xl font-bold text-[#25221F]">
                  #{order.id}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Package size={21} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-xl font-bold text-[#25221F]">
                  {items.reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <ShoppingBag size={21} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Total</p>
                <p className="text-xl font-bold text-[#25221F]">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Customer and Order Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-[#B95F3B]">
                <User size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#25221F]">
                Customer Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Customer Name
                </p>
                <p className="mt-1 font-medium text-[#25221F]">
                  {order.customerName || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email Address
                </p>
                <div className="mt-1 flex items-center gap-2 break-all text-sm text-gray-600">
                  <Mail size={15} className="shrink-0 text-gray-400" />
                  {order.customerEmail || "Not available"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <CalendarDays size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#25221F]">
                Order Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Order Date
                </p>
                <p className="mt-1 font-medium text-[#25221F]">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Current Status
                </p>
                <span
                  className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* Ordered Items */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#25221F]">
              Ordered Items
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Products included in this order
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No items found for this order.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-[#F5F0E7] text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Item</th>
                      <th className="px-6 py-4 font-semibold">Quantity</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Subtotal
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.menuItemId}>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-[#25221F]">
                            {item.menuItemName}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Item #{item.menuItemId}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-5 text-right text-sm font-semibold text-[#25221F]">
                          {formatPrice(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Item Cards */}
              <div className="divide-y divide-gray-100 md:hidden">
                {items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="space-y-3 p-5"
                  >
                    <div>
                      <p className="font-semibold text-[#25221F]">
                        {item.menuItemName}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Item #{item.menuItemId}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Quantity</p>
                        <p className="mt-1 font-medium text-[#25221F]">
                          {item.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="mt-1 font-medium text-[#25221F]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Subtotal</p>
                        <p className="mt-1 font-semibold text-[#B95F3B]">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Total */}
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 bg-[#FAF8F4] p-5 sm:px-6">
            <span className="font-semibold text-gray-600">Grand Total</span>
            <span className="text-xl font-bold text-[#B95F3B]">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}

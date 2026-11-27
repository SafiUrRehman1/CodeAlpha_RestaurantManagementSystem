
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Utensils,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import CustomerLayout from "../../layouts/CustomerLayout";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [placingOrder, setPlacingOrder] = useState(false);

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-PK");

  async function placeOrder() {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (placingOrder) return;

    try {
      setPlacingOrder(true);

      await api.post("/orders", {
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();

      toast.success("Order placed successfully!");

      navigate("/customer/my-orders");
    } catch (error) {
      console.error("Order placement failed:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#F5F0E7]">

        {/* HEADER */}

        <section className="bg-[#25221F] text-white">
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16">

            <p className="uppercase tracking-[4px] text-xs font-bold text-[#D58A65] mb-4">
              Almost There
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E7]">
              Complete Your Order
            </h1>

            <p className="text-[#C9BFB4] mt-4 max-w-xl leading-7">
              Review your selected dishes and confirm your order.
              We look forward to serving you.
            </p>

          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-14">

          {/* CHECKOUT PROGRESS */}

          <div className="flex items-center gap-3 mb-10 text-sm">

            <div className="flex items-center gap-2 text-[#B95F3B] font-semibold">
              <CheckCircle2 size={19} />
              Cart
            </div>

            <div className="h-px bg-[#D8CABC] flex-1 max-w-16" />

            <div className="flex items-center gap-2 text-[#B95F3B] font-semibold">
              <ShoppingBag size={19} />
              Checkout
            </div>

            <div className="h-px bg-[#D8CABC] flex-1 max-w-16" />

            <div className="flex items-center gap-2 text-[#81776D]">
              <CheckCircle2 size={19} />
              Confirmation
            </div>

          </div>

          {cartItems.length === 0 ? (

            /* EMPTY CART */

            <div className="max-w-2xl mx-auto bg-white border border-[#E9E1D7] rounded-3xl p-8 md:p-16 text-center">

              <div className="w-20 h-20 rounded-full bg-[#F5F0E7] flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={38} className="text-[#B95F3B]" />
              </div>

              <h2 className="text-3xl font-bold">
                Nothing to checkout
              </h2>

              <p className="text-[#81776D] mt-4 leading-7">
                Your shopping cart is empty. Add some dishes
                before proceeding to checkout.
              </p>

              <Link
                to="/customer/menu"
                className="inline-flex items-center gap-3 mt-8 bg-[#B95F3B] hover:bg-[#98472B] text-white px-7 py-4 rounded-xl font-semibold transition"
              >
                Explore Menu
                <ArrowRight size={18} />
              </Link>

            </div>

          ) : (

            <div className="grid lg:grid-cols-3 gap-8 items-start">

              {/* ORDER DETAILS */}

              <section className="lg:col-span-2">

                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Review Your Order
                  </h2>

                  <p className="text-sm text-[#81776D] mt-2">
                    Please check your items before confirming.
                  </p>
                </div>

                <div className="bg-white border border-[#E9E1D7] rounded-2xl overflow-hidden">

                  <div className="px-5 md:px-7 py-5 border-b border-[#E9E1D7] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Utensils size={21} className="text-[#B95F3B]" />

                      <h3 className="font-bold text-lg">
                        Your Selected Dishes
                      </h3>
                    </div>

                    <span className="text-sm text-[#81776D]">
                      {totalItems} items
                    </span>
                  </div>

                  <div className="px-5 md:px-7">

                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="py-6 border-b border-[#E9E1D7] last:border-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >

                        <div className="flex items-center gap-4 min-w-0">

                          <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F5F0E7] flex items-center justify-center">
                            <Utensils size={21} className="text-[#B95F3B]" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-[#25221F] break-words">
                              {item.itemName}
                            </h4>

                            <p className="text-sm text-[#81776D] mt-1">
                              Rs. {formatPrice(item.price)} × {item.quantity}
                            </p>
                          </div>

                        </div>

                        <div className="sm:text-right pl-16 sm:pl-0">
                          <p className="text-xs text-[#81776D] mb-1">
                            Subtotal
                          </p>

                          <p className="text-lg font-bold text-[#B95F3B]">
                            Rs. {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                      </div>
                    ))}

                  </div>

                  <div className="bg-[#FAF8F4] px-5 md:px-7 py-5 flex justify-between items-center gap-3">
                    <span className="font-semibold text-[#51483F]">
                      Total Quantity
                    </span>

                    <span className="font-bold text-[#25221F]">
                      {totalItems} items
                    </span>
                  </div>

                </div>

                <Link
                  to="/customer/cart"
                  className="inline-flex items-center gap-2 mt-6 text-[#B95F3B] font-semibold hover:gap-3 transition-all"
                >
                  <ArrowLeft size={18} />
                  Return to Cart
                </Link>

              </section>

              {/* ORDER SUMMARY */}

              <aside className="bg-white border border-[#E9E1D7] rounded-2xl p-6 md:p-7 shadow-sm lg:sticky lg:top-24">

                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0E7] flex items-center justify-center">
                    <ShoppingBag size={21} className="text-[#B95F3B]" />
                  </div>

                  <h2 className="text-2xl font-bold">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-5">

                  <div className="flex justify-between text-sm">
                    <span className="text-[#81776D]">
                      Total Items
                    </span>

                    <span className="font-semibold">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#81776D]">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      Rs. {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-[#D8CABC] pt-5">

                    <div className="flex justify-between items-center gap-3">
                      <span className="font-bold text-[#25221F]">
                        Total Amount
                      </span>

                      <span className="text-2xl font-bold text-[#B95F3B]">
                        Rs. {formatPrice(totalPrice)}
                      </span>
                    </div>

                    <p className="text-xs text-[#81776D] mt-3 leading-5">
                      This is the current order subtotal. Any additional
                      charges will depend on your ordering arrangements.
                    </p>

                  </div>

                </div>

                <button
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className="w-full mt-8 flex items-center justify-center gap-3 bg-[#B95F3B] hover:bg-[#98472B] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition"
                >
                  {placingOrder ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Confirm Order
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#81776D]">
                  <ShieldCheck size={16} />
                  Order submitted securely through your account
                </div>

              </aside>

            </div>

          )}

        </main>
      </div>
    </CustomerLayout>
  );
}

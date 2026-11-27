
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";

import CustomerLayout from "../../layouts/CustomerLayout";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-PK");

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#F5F0E7]">

        {/* PAGE HEADER */}

        <section className="bg-[#25221F] text-white">
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16">

            <p className="uppercase tracking-[4px] text-xs font-bold text-[#D58A65] mb-4">
              Your Selection
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E7]">
              Your Shopping Cart
            </h1>

            <p className="text-[#C9BFB4] mt-4">
              Review your items and get ready for a delicious meal.
            </p>

          </div>
        </section>

        {/* CART CONTENT */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-14">

          {cartItems.length === 0 ? (

            /* EMPTY CART */

            <div className="max-w-2xl mx-auto bg-white border border-[#E9E1D7] rounded-3xl p-8 md:p-16 text-center shadow-sm">

              <div className="w-20 h-20 rounded-full bg-[#F5F0E7] flex items-center justify-center mx-auto mb-7">
                <ShoppingBag
                  size={38}
                  className="text-[#B95F3B]"
                />
              </div>

              <h2 className="text-3xl font-bold">
                Your cart is empty
              </h2>

              <p className="text-[#81776D] mt-4 leading-7">
                You haven't added anything to your cart yet.
                Explore our menu and discover something delicious.
              </p>

              <Link
                to="/customer/menu"
                className="inline-flex items-center justify-center gap-3 mt-8 bg-[#B95F3B] hover:bg-[#98472B] text-white px-7 py-4 rounded-xl font-semibold transition"
              >
                <Utensils size={19} />
                Explore Our Menu
                <ArrowRight size={18} />
              </Link>

            </div>

          ) : (

            <div className="grid lg:grid-cols-3 gap-8 items-start">

              {/* CART ITEMS */}

              <section className="lg:col-span-2">

                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Cart Items
                    </h2>

                    <p className="text-sm text-[#81776D] mt-2">
                      {totalItems} items in your cart
                    </p>
                  </div>

                  <Link
                    to="/customer/menu"
                    className="text-sm font-semibold text-[#B95F3B] hover:text-[#98472B]"
                  >
                    + Add More Items
                  </Link>

                </div>

                <div className="space-y-4">

                  {cartItems.map((item) => (

                    <article
                      key={item.id}
                      className="bg-white border border-[#E9E1D7] rounded-2xl p-4 sm:p-6 shadow-sm"
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                        {/* ITEM ICON */}

                        <div className="w-16 h-16 shrink-0 rounded-xl bg-[#F5F0E7] flex items-center justify-center">
                          <Utensils
                            size={27}
                            className="text-[#B95F3B]"
                          />
                        </div>

                        {/* ITEM DETAILS */}

                        <div className="flex-1 min-w-0">

                          <h3 className="text-lg font-bold text-[#25221F] break-words">
                            {item.itemName}
                          </h3>

                          <p className="text-sm text-[#81776D] mt-1">
                            Rs. {formatPrice(item.price)} per item
                          </p>

                        </div>

                        {/* REMOVE BUTTON */}

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="self-start sm:self-center flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition"
                          aria-label={`Remove ${item.itemName}`}
                        >
                          <Trash2 size={18} />
                          <span className="sm:hidden">Remove item</span>
                        </button>

                      </div>

                      {/* QUANTITY AND SUBTOTAL */}

                      <div className="mt-5 pt-5 border-t border-[#E9E1D7] flex flex-wrap items-center justify-between gap-5">

                        <div className="flex items-center gap-3">

                          <span className="text-sm text-[#81776D]">
                            Quantity
                          </span>

                          <div className="flex items-center border border-[#E9E1D7] rounded-lg overflow-hidden">

                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-10 h-10 flex items-center justify-center bg-[#F5F0E7] hover:bg-[#E9E1D7] transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="w-11 text-center font-bold text-[#25221F]">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-10 h-10 flex items-center justify-center bg-[#F5F0E7] hover:bg-[#E9E1D7] transition"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>

                          </div>

                        </div>

                        <div className="text-right">

                          <p className="text-xs text-[#81776D] mb-1">
                            Item Subtotal
                          </p>

                          <p className="text-xl font-bold text-[#B95F3B]">
                            Rs. {formatPrice(item.price * item.quantity)}
                          </p>

                        </div>

                      </div>

                    </article>

                  ))}

                </div>

                {/* CONTINUE SHOPPING */}

                <Link
                  to="/customer/menu"
                  className="inline-flex items-center gap-2 mt-7 text-[#B95F3B] font-semibold hover:gap-3 transition-all"
                >
                  <ArrowRight className="rotate-180" size={18} />
                  Continue Shopping
                </Link>

              </section>

              {/* ORDER SUMMARY */}

              <aside className="bg-white border border-[#E9E1D7] rounded-2xl p-6 md:p-7 shadow-sm lg:sticky lg:top-24">

                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0E7] flex items-center justify-center">
                    <ShoppingCart
                      size={21}
                      className="text-[#B95F3B]"
                    />
                  </div>

                  <h2 className="text-2xl font-bold">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-5">

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#81776D]">
                      Total Items
                    </span>

                    <span className="font-semibold text-[#25221F]">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#81776D]">
                      Subtotal
                    </span>

                    <span className="font-semibold text-[#25221F]">
                      Rs. {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-[#D8CABC] pt-5">

                    <div className="flex justify-between items-center gap-3">

                      <span className="font-bold text-[#25221F]">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-[#B95F3B]">
                        Rs. {formatPrice(totalPrice)}
                      </span>

                    </div>

                    <p className="text-xs text-[#81776D] mt-2">
                      Additional charges, if applicable, will be shown at checkout.
                    </p>

                  </div>

                </div>

                <Link
                  to="/customer/checkout"
                  className="flex items-center justify-center gap-3 w-full mt-8 bg-[#B95F3B] hover:bg-[#98472B] text-white py-4 rounded-xl font-bold transition"
                >
                  Proceed to Checkout
                  <ArrowRight size={19} />
                </Link>

                <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#81776D]">
                  <ShoppingBag size={15} />
                  Your cart is saved automatically
                </div>

              </aside>

            </div>

          )}

        </main>

      </div>
    </CustomerLayout>
  );
}

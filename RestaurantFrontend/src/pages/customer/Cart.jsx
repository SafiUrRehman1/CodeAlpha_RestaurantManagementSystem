import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
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

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-12 text-center">

            <ShoppingBag
              size={60}
              className="mx-auto text-orange-500 mb-5"
            />

            <h2 className="text-2xl font-semibold mb-3">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Add some delicious food from our menu.
            </p>

            <Link
              to="/customer/menu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Browse Menu
            </Link>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}

            <div className="lg:col-span-2 bg-white rounded-xl shadow">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="border-b p-6"
                >

                  <div className="flex justify-between">

                    <div>

                      <h2 className="text-xl font-semibold">
                        {item.itemName}
                      </h2>

                      <p className="text-orange-600 font-bold mt-2">
                        Rs. {Number(item.price).toLocaleString()}
                      </p>

                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={22} />
                    </button>

                  </div>

                  <div className="flex justify-between items-center mt-5">

                    <div className="flex items-center gap-4">

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="font-bold text-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                      >
                        <Plus size={18} />
                      </button>

                    </div>

                    <div className="font-bold text-lg text-orange-600">

                      Rs.{" "}
                      {Number(
                        item.price * item.quantity
                      ).toLocaleString()}

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* Summary */}

            <div className="bg-white rounded-xl shadow p-6 h-fit">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-4">

                <span>Total Items</span>

                <span className="font-semibold">
                  {totalItems}
                </span>

              </div>

              <div className="flex justify-between mb-6">

                <span>Total Price</span>

                <span className="font-bold text-2xl text-orange-600">
                  Rs. {Number(totalPrice).toLocaleString()}
                </span>

              </div>

              <Link
                to="/customer/checkout"
                className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/customer/menu"
                className="block w-full text-center mt-4 border border-orange-500 text-orange-600 py-3 rounded-lg hover:bg-orange-50"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        )}

      </div>
    </CustomerLayout>
  );
}
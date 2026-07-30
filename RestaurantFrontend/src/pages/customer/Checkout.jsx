import { useNavigate } from "react-router-dom";
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

  async function placeOrder() {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      await api.post("/orders", {
        items: cartItems.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();

      toast.success("Order placed successfully!");

      navigate("/customer/my-orders");
    } catch (error) {
      console.log(error);

      toast.error("Unable to place order.");
    }
  }

  return (
    <CustomerLayout>

      <div className="max-w-5xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Order Items */}

          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="text-2xl font-semibold mb-6">
              Your Order
            </h2>

            {cartItems.map(item => (

              <div
                key={item.id}
                className="flex justify-between border-b py-4"
              >

                <div>

                  <h3 className="font-semibold">
                    {item.itemName}
                  </h3>

                  <p className="text-gray-500">
                    Qty: {item.quantity}
                  </p>

                </div>

                <div className="font-bold">

                  Rs. {(item.price * item.quantity).toLocaleString()}

                </div>

              </div>

            ))}

          </div>

          {/* Summary */}

          <div className="bg-white shadow rounded-xl p-6 h-fit">

            <h2 className="text-2xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between mb-4">

              <span>Total Items</span>

              <span>{totalItems}</span>

            </div>

            <div className="flex justify-between mb-8">

              <span>Total Amount</span>

              <span className="text-2xl font-bold text-orange-600">

                Rs. {Number(totalPrice).toLocaleString()}

              </span>

            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              Confirm Order
            </button>

          </div>

        </div>

      </div>

    </CustomerLayout>
  );
}
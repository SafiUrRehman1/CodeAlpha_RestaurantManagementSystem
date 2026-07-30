import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const response = await api.get(`/orders/my-orders/${id}`);

      setOrder(response.data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-5xl mx-auto py-16">
          <h2 className="text-2xl font-bold">
            Loading...
          </h2>
        </div>
      </CustomerLayout>
    );
  }

  if (!order) {
    return (
      <CustomerLayout>
        <div className="max-w-5xl mx-auto py-16">
          <h2 className="text-2xl font-bold text-red-600">
            Order not found.
          </h2>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>

      <div className="max-w-5xl mx-auto py-10 px-6">

        <Link
          to="/customer/my-orders"
          className="text-orange-600 hover:underline"
        >
          ← Back to Orders
        </Link>

        <div className="bg-white shadow rounded-xl mt-6 p-8">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-4xl font-bold">

                Order #{order.id}

              </h1>

              <p className="text-gray-500 mt-2">

                {new Date(order.createdAt).toLocaleString()}

              </p>

            </div>

            <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">

              {order.status}

            </span>

          </div>

          <hr className="my-8" />

          <h2 className="text-2xl font-bold mb-6">

            Ordered Items

          </h2>

          <div className="space-y-4">

            {order.items.map(item => (

              <div
                key={item.menuItemId}
                className="flex justify-between border rounded-lg p-5"
              >

                <div>

                  <h3 className="font-semibold text-lg">

                    {item.menuItemName}

                  </h3>

                  <p className="text-gray-500">

                    Quantity: {item.quantity}

                  </p>

                </div>

                <div className="text-right">

                  <p>

                    Rs. {Number(item.price).toLocaleString()}

                  </p>

                  <p className="font-bold text-orange-600">

                    Rs. {Number(item.subtotal).toLocaleString()}

                  </p>

                </div>

              </div>

            ))}

          </div>

          <hr className="my-8" />

          <div className="flex justify-end">

            <div className="text-right">

              <h2 className="text-gray-500">

                Total Amount

              </h2>

              <h1 className="text-4xl font-bold text-orange-600">

                Rs. {Number(order.totalAmount).toLocaleString()}

              </h1>

            </div>

          </div>

        </div>

      </div>

    </CustomerLayout>
  );
}
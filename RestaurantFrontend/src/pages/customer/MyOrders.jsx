import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import { Link } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const response = await api.get("/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  function badgeColor(status) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Preparing":
        return "bg-blue-100 text-blue-700";

      case "Ready":
        return "bg-purple-100 text-purple-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <CustomerLayout>

      <div className="max-w-6xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {loading ? (
          <div className="text-center py-10">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">

            <h2 className="text-2xl font-semibold mb-3">
              No Orders Yet
            </h2>

            <p className="text-gray-500">
              Place your first order from our menu.
            </p>

          </div>
        ) : (

          <div className="space-y-5">

            {orders.map(order => (

              <div
                key={order.id}
                className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
              >

                <div>

                  <h2 className="text-xl font-bold">

                    Order #{order.id}

                  </h2>

                  <p className="text-gray-500 mt-2">

                    {new Date(order.createdAt).toLocaleString()}

                  </p>

                  <p className="mt-3 font-semibold text-orange-600">

                    Rs. {Number(order.totalAmount).toLocaleString()}

                  </p>

                </div>
<div className="flex flex-col items-end gap-4">

  <span
    className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(
      order.status
    )}`}
  >
    {order.status}
  </span>

  <Link
    to={`/customer/my-orders/${order.id}`}
    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-center"
  >
    View Details
  </Link>

</div>

              </div>

            ))}

          </div>

        )}

      </div>

    </CustomerLayout>
  );
}
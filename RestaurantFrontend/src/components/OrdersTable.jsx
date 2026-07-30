import { Pencil, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrdersTable({
  orders,
  setSelectedOrder,
  setShowModal,
}) {

  const navigate = useNavigate();

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
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-4">Order #</th>

            <th className="text-left py-4">Customer</th>

            <th className="text-left py-4">Total</th>

            <th className="text-left py-4">Status</th>

            <th className="text-left py-4">Date</th>

            <th className="text-center py-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {orders.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="text-center py-10 text-gray-500"
              >
                No Orders Found
              </td>

            </tr>

          ) : (

            orders.map((order) => (

              <tr
                key={order.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4 font-semibold">
                  #{order.id}
                </td>

                <td>{order.customerName}</td>

                <td>
                  Rs. {Number(order.totalAmount).toLocaleString()}
                </td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor(order.status)}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    {/* View Details */}
                    <button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>

                    {/* Edit Status */}
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Status"
                    >
                      <Pencil size={20} />
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}
import { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  CalendarDays,
  TriangleAlert,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [recentOrders, setRecentOrders] = useState([]);

  const [lowStockItems, setLowStockItems] = useState([]);

  const [topSellingItems, setTopSellingItems] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadRecentOrders();
    loadLowStockItems();
    loadTopSellingItems();
  }, []);

  async function loadDashboard() {
    try {
      const response = await api.get("/admin/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadRecentOrders() {
    try {
      const response = await api.get("/admin/recent-orders");
      setRecentOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadLowStockItems() {
    try {
      const response = await api.get("/admin/low-stock");
      setLowStockItems(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadTopSellingItems() {
    try {
      const response = await api.get("/admin/top-selling-items");
      setTopSellingItems(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (!dashboard) {
    return (
      <AdminLayout>
        <h2 className="text-2xl font-semibold">
          Loading Dashboard...
        </h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <DashboardCard
          title="Customers"
          value={dashboard.totalCustomers}
          color="text-blue-600"
          icon={<Users size={42} />}
        />

        <DashboardCard
          title="Orders"
          value={dashboard.totalOrders}
          color="text-green-600"
          icon={<ShoppingCart size={42} />}
        />

        <DashboardCard
          title="Revenue"
          value={`Rs. ${Number(dashboard.totalRevenue).toLocaleString()}`}
          color="text-emerald-600"
          icon={<DollarSign size={42} />}
        />

        <DashboardCard
          title="Reservations"
          value={dashboard.totalReservations}
          color="text-purple-600"
          icon={<CalendarDays size={42} />}
        />

        <DashboardCard
          title="Low Stock"
          value={dashboard.lowStockItems}
          color="text-red-600"
          icon={<TriangleAlert size={42} />}
        />

      </div>

      {/* Recent Orders */}

      <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-5">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b bg-gray-100">

              <tr>

                <th className="text-left p-3">Customer</th>

                <th className="text-left p-3">Amount</th>

                <th className="text-left p-3">Date</th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{order.customerEmail}</td>

                    <td className="p-3">
                      Rs. {Number(order.totalAmount).toLocaleString()}
                    </td>

                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center p-5 text-gray-500"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

        {/* Low Stock */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Low Stock Items
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b bg-gray-100">

                <tr>

                  <th className="text-left p-3">Item</th>

                  <th className="text-left p-3">Quantity</th>

                  <th className="text-left p-3">Minimum</th>

                </tr>

              </thead>

              <tbody>

                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{item.name}</td>

                      <td className="p-3 text-red-600 font-bold">
                        {item.quantity}
                      </td>

                      <td className="p-3">{item.minimumStock}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center p-5 text-gray-500"
                    >
                      No low stock items.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Top Selling */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Top Selling Menu Items
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b bg-gray-100">

                <tr>

                  <th className="text-left p-3">Menu Item</th>

                  <th className="text-left p-3">Total Sold</th>

                </tr>

              </thead>

              <tbody>

                {topSellingItems.length > 0 ? (
                  topSellingItems.map((item) => (
                    <tr
                      key={item.menuItemId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {item.menuItemName}
                      </td>

                      <td className="p-3 text-green-600 font-bold">
                        {item.totalSold}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center p-5 text-gray-500"
                    >
                      No sales yet.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}
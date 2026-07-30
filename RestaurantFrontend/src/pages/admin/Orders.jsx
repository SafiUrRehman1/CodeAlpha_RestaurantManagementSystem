import { useEffect, useState } from "react";
import { Search, ShoppingCart, RefreshCcw } from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import OrdersTable from "../../components/OrdersTable";
import EditOrderModal from "../../components/EditOrderModal";
import DashboardCard from "../../components/DashboardCard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // Statistics Cards
  const pendingCount = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const preparingCount = orders.filter(
    (o) => o.status === "Preparing"
  ).length;

  const readyCount = orders.filter(
    (o) => o.status === "Ready"
  ).length;

  const completedCount = orders.filter(
    (o) => o.status === "Completed"
  ).length;

  // Search + Filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold flex items-center gap-3">
            <ShoppingCart className="text-blue-600" />
            Orders Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer orders
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <DashboardCard
          title="Pending"
          value={pendingCount}
          color="text-yellow-600"
        />

        <DashboardCard
          title="Preparing"
          value={preparingCount}
          color="text-blue-600"
        />

        <DashboardCard
          title="Ready"
          value={readyCount}
          color="text-purple-600"
        />

        <DashboardCard
          title="Completed"
          value={completedCount}
          color="text-green-600"
        />
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">
        <div className="flex justify-between mb-6">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <OrdersTable
          orders={filteredOrders}
          loadOrders={loadOrders}
          setSelectedOrder={setSelectedOrder}
          setShowModal={setShowModal}
        />
      </div>

      <EditOrderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        order={selectedOrder}
        loadOrders={loadOrders}
      />
    </AdminLayout>
  );
}
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Boxes,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";
import InventoryTable from "../../components/InventoryTable";
import AddInventoryModal from "../../components/AddInventoryModal";
import EditInventoryModal from "../../components/EditInventoryModal";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const response = await api.get("/InventoryItems");

      setInventoryItems(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // Dashboard Cards

  const totalItems = inventoryItems.length;

  const lowStockCount =
    inventoryItems.filter(i => i.isLowStock).length;

  const healthyStock =
    totalItems - lowStockCount;

  // Search + Filter

  const filteredItems = inventoryItems.filter(item => {

    const matchesSearch =
      item.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "low"
        ? item.isLowStock
        : !item.isLowStock;

    return matchesSearch && matchesFilter;

  });

  return (
    <AdminLayout>

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold flex items-center gap-3">

            <Boxes className="text-orange-500" />

            Inventory Management

          </h1>

          <p className="text-gray-500 mt-2">
            Manage restaurant inventory
          </p>

        </div>
<button
  onClick={() => setShowAddModal(true)}
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
>
  <Plus size={20} />
  Add Item
</button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <DashboardCard
          title="Total Items"
          value={totalItems}
          color="text-blue-600"
        />

        <DashboardCard
          title="Healthy Stock"
          value={healthyStock}
          color="text-green-600"
        />

        <DashboardCard
          title="Low Stock"
          value={lowStockCount}
          color="text-red-600"
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
              placeholder="Search inventory..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={filter}
            onChange={(e)=>setFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >

            <option value="all">
              All
            </option>

            <option value="healthy">
              Healthy Stock
            </option>

            <option value="low">
              Low Stock
            </option>

          </select>

        </div>

        <InventoryTable
          inventoryItems={filteredItems}
          loadInventory={loadInventory}
          setSelectedItem={setSelectedItem}
          setShowEditModal={setShowEditModal}
        />

      </div>

      {<AddInventoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        loadInventory={loadInventory}
      />
}
 
      <EditInventoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
        loadInventory={loadInventory}
      /> 

    </AdminLayout>
  );
}
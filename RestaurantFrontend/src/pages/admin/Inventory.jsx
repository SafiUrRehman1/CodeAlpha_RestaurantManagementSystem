
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInventory() {
    try {
      setError("");
      const response = await api.get("/InventoryItems");
      setInventoryItems(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setError("Unable to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const stats = useMemo(() => {
    const lowStock = inventoryItems.filter(
      (item) => item.isLowStock
    ).length;

    return {
      total: inventoryItems.length,
      lowStock,
      healthy: inventoryItems.length - lowStock,
    };
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch = (item.name || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "low" && item.isLowStock) ||
        (filter === "healthy" && !item.isLowStock);

      return matchesSearch && matchesFilter;
    });
  }, [inventoryItems, search, filter]);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#B95F3B]">
              <Boxes size={18} />
              Restaurant Management
            </div>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Inventory Management
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Monitor stock levels and manage restaurant supplies.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#B95F3B] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#984A2D] sm:w-auto"
          >
            <Plus size={19} />
            Add Inventory Item
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="mt-2 text-3xl font-bold text-[#25221F]">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-[#B95F3B]">
                <Boxes size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Healthy Stock</p>
                <p className="mt-2 text-3xl font-bold text-green-700">
                  {stats.healthy}
                </p>
              </div>
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle2 size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {stats.lowStock}
                </p>
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <AlertTriangle size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#25221F]">
              Inventory Items
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review quantities and identify items that need restocking.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={19}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAF8F4] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                />
              </div>

              <div className="relative sm:w-52">
                <SlidersHorizontal
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-[#FAF8F4] py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-[#B95F3B]"
                >
                  <option value="all">All Items</option>
                  <option value="healthy">Healthy Stock</option>
                  <option value="low">Low Stock</option>
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
              <p className="text-sm text-gray-600">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  loadInventory();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#B95F3B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#984A2D]"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#B95F3B] border-t-transparent" />
              Loading inventory...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-[#25221F]">
                    {filteredItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#25221F]">
                    {inventoryItems.length}
                  </span>{" "}
                  items
                </p>

                {(search || filter !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className="text-sm font-semibold text-[#B95F3B] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <InventoryTable
                inventoryItems={filteredItems}
                loadInventory={loadInventory}
                setSelectedItem={setSelectedItem}
                setShowEditModal={setShowEditModal}
              />
            </>
          )}
        </section>
      </div>

      <AddInventoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        loadInventory={loadInventory}
      />

      <EditInventoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
        loadInventory={loadInventory}
      />
    </AdminLayout>
  );
}

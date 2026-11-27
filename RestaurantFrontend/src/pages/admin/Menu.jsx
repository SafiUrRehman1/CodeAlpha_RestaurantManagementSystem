
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Utensils,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import EditMenuModal from "../../components/EditMenuModal";
import AddMenuModal from "../../components/AddMenuModal";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import MenuTable from "../../components/MenuTable";

export default function Menu() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMenuItems() {
    try {
      setError("");
      const response = await api.get("/menu/admin");
      setMenuItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load menu items:", err);
      setError("Unable to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenuItems();
  }, []);

  const stats = useMemo(() => ({
    total: menuItems.length,
    available: menuItems.filter((item) => item.isAvailable).length,
    disabled: menuItems.filter((item) => !item.isAvailable).length,
  }), [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const name = (item.itemName || "").toLowerCase();
      const matchesSearch = name.includes(search.toLowerCase().trim());

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && item.isAvailable) ||
        (filter === "disabled" && !item.isAvailable);

      return matchesSearch && matchesFilter;
    });
  }, [menuItems, search, filter]);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#B95F3B]">
              <UtensilsCrossed size={17} />
              Restaurant Management
            </div>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Menu Management
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your restaurant's dishes, prices, and availability.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#B95F3B] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#984A2D] sm:w-auto"
          >
            <Plus size={19} />
            Add Menu Item
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Menu Items</p>
                <p className="mt-2 text-3xl font-bold text-[#25221F]">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-[#B95F3B]">
                <Utensils size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available Items</p>
                <p className="mt-2 text-3xl font-bold text-green-700">
                  {stats.available}
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
                <p className="text-sm text-gray-500">Disabled Items</p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {stats.disabled}
                </p>
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <XCircle size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#25221F]">
                Your Menu Items
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Search, edit, or update the availability of menu items.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={19}
                />
                <input
                  type="text"
                  placeholder="Search by item name..."
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
                  <option value="available">Available</option>
                  <option value="disabled">Disabled</option>
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
                  loadMenuItems();
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
              Loading menu items...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-[#25221F]">{filteredItems.length}</span> of{" "}
                  <span className="font-semibold text-[#25221F]">{menuItems.length}</span> items
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

              <MenuTable
                menuItems={filteredItems}
                loadMenuItems={loadMenuItems}
                setSelectedItem={setSelectedItem}
                setShowEditModal={setShowEditModal}
              />
            </>
          )}
        </section>

      </div>

      <AddMenuModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        loadMenuItems={loadMenuItems}
      />

      <EditMenuModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedItem={selectedItem}
        loadMenuItems={loadMenuItems}
      />
    </AdminLayout>
  );
}

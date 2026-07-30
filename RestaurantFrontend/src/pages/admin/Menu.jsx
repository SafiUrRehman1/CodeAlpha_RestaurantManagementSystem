import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  UtensilsCrossed,
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

  useEffect(() => {
    loadMenuItems();
  }, []);

  async function loadMenuItems() {
    try {
      const response = await api.get("/menu/admin");
      setMenuItems(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const filteredItems = menuItems.filter(item => {

    const matchesSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "available"
        ? item.isAvailable
        : !item.isAvailable;

    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold flex items-center gap-3">
            <UtensilsCrossed className="text-orange-500" />
            Menu Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage restaurant menu items
          </p>

        </div>
<button
  onClick={() => setShowAddModal(true)}
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
>
  <Plus size={20}/>
  Add Menu Item
</button>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

        <div className="flex justify-between mb-6">

          <div className="relative w-80">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search menu..."
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
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="disabled">Disabled</option>
          </select>

        </div>

        <MenuTable
  menuItems={filteredItems}
  loadMenuItems={loadMenuItems}
  setSelectedItem={setSelectedItem}
  setShowEditModal={setShowEditModal}
/>

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
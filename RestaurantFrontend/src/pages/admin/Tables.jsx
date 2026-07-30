import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Table2,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";
import TablesTable from "../../components/TablesTable";
import AddTableModal from "../../components/AddTableModal";
import EditTableModal from "../../components/EditTableModal";

export default function Tables() {

  const [tables, setTables] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {

    try {

      const response = await api.get("/tables");

      setTables(response.data);

    } catch (error) {

      console.log(error);

    }

  }

  const totalTables = tables.length;

  const occupiedTables =
    tables.filter(t => t.isOccupied).length;

  const availableTables =
    totalTables - occupiedTables;

  const filteredTables = tables.filter(table => {

    const matchesSearch =
      table.tableNumber
        .toString()
        .includes(search);

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "occupied"
        ? table.isOccupied
        : !table.isOccupied;

    return matchesSearch && matchesFilter;

  });

  return (

    <AdminLayout>

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold flex items-center gap-3">

            <Table2 className="text-orange-500"/>

            Restaurant Tables

          </h1>

          <p className="text-gray-500 mt-2">

            Manage restaurant tables

          </p>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >

          <Plus size={20}/>

          Add Table

        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <DashboardCard
          title="Total Tables"
          value={totalTables}
          color="text-blue-600"
        />

        <DashboardCard
          title="Available"
          value={availableTables}
          color="text-green-600"
        />

        <DashboardCard
          title="Occupied"
          value={occupiedTables}
          color="text-red-600"
        />

      </div>

      <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

        <div className="flex justify-between mb-6">

          <div className="relative w-80">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />

            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search table..."
              className="w-full border rounded-xl pl-10 pr-4 py-3"
            />

          </div>

          <select
            value={filter}
            onChange={(e)=>setFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >

            <option value="all">All</option>

            <option value="available">Available</option>

            <option value="occupied">Occupied</option>

          </select>

        </div>

        <TablesTable
          tables={filteredTables}
          loadTables={loadTables}
          setSelectedTable={setSelectedTable}
          setShowEditModal={setShowEditModal}
        />

      </div>

      <AddTableModal
        isOpen={showAddModal}
        onClose={()=>setShowAddModal(false)}
        loadTables={loadTables}
      />

      <EditTableModal
        isOpen={showEditModal}
        onClose={()=>setShowEditModal(false)}
        table={selectedTable}
        loadTables={loadTables}
      />

    </AdminLayout>

  );

}
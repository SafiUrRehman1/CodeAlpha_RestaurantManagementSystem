import { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  RefreshCcw,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";
import ReservationsTable from "../../components/ReservationsTable";
import EditReservationModal from "../../components/EditReservationModal";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedReservation, setSelectedReservation] =
    useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      const response = await api.get("/Reservations/admin");

      setReservations(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const pendingCount =
    reservations.filter(r => r.status === "Pending").length;

  const confirmedCount =
    reservations.filter(r => r.status === "Confirmed").length;

  const completedCount =
    reservations.filter(r => r.status === "Completed").length;

  const cancelledCount =
    reservations.filter(r => r.status === "Cancelled").length;

  const filteredReservations = reservations.filter(r => {

    const matchesSearch =
      r.userName
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : r.status === statusFilter;

    return matchesSearch && matchesStatus;

  });

  return (
    <AdminLayout>

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold flex items-center gap-3">

            <CalendarDays className="text-purple-600"/>

            Reservations

          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer reservations
          </p>

        </div>

        <button
          onClick={loadReservations}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          <RefreshCcw size={18}/>
          Refresh
        </button>

      </div>

      {/* Dashboard */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        <DashboardCard
          title="Pending"
          value={pendingCount}
          color="text-yellow-600"
        />

        <DashboardCard
          title="Confirmed"
          value={confirmedCount}
          color="text-blue-600"
        />

        <DashboardCard
          title="Completed"
          value={completedCount}
          color="text-green-600"
        />

        <DashboardCard
          title="Cancelled"
          value={cancelledCount}
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
              placeholder="Search customer..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 py-3 pr-4"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

        </div>

        <ReservationsTable
          reservations={filteredReservations}
          loadReservations={loadReservations}
          setSelectedReservation={setSelectedReservation}
          setShowModal={setShowModal}
        />

      </div>

      <EditReservationModal
        isOpen={showModal}
        reservation={selectedReservation}
        loadReservations={loadReservations}
        onClose={()=>setShowModal(false)}
      />

    </AdminLayout>
  );
}
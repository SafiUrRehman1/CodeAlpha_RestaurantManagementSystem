import { useEffect, useState } from "react";
import {
  Search,
  Users,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";
import CustomersTable from "../../components/CustomersTable";
import EditCustomerModal from "../../components/EditCustomerModal";

export default function Customers() {

  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {

    try {

      const response = await api.get("/users");

      setCustomers(response.data);

    } catch (error) {

      console.log(error);

    }

  }

  const totalCustomers = customers.length;

  const adminCount =
    customers.filter(c => c.role === "Admin").length;

  const CustomerCount =
    customers.filter(c => c.role === "Customer").length;

  const filteredCustomers = customers.filter(customer =>
    customer.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    customer.email
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <AdminLayout>

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-5xl font-bold flex items-center gap-3">

            <Users className="text-blue-600"/>

            Customers

          </h1>

          <p className="text-gray-500 mt-2">

            Manage registered users

          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <DashboardCard
          title="Total Users"
          value={totalCustomers}
          color="text-blue-600"
        />

        <DashboardCard
          title="Customers"
          value={CustomerCount}
          color="text-green-600"
        />

        <DashboardCard
          title="Admins"
          value={adminCount}
          color="text-purple-600"
        />

      </div>

      <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

        <div className="relative w-80 mb-6">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full border rounded-xl pl-10 pr-4 py-3"
          />

        </div>

        <CustomersTable
          customers={filteredCustomers}
          loadCustomers={loadCustomers}
          setSelectedCustomer={setSelectedCustomer}
          setShowEditModal={setShowEditModal}
        />

      </div>

      <EditCustomerModal
        isOpen={showEditModal}
        onClose={()=>setShowEditModal(false)}
        customer={selectedCustomer}
        loadCustomers={loadCustomers}
      />

    </AdminLayout>

  );

}
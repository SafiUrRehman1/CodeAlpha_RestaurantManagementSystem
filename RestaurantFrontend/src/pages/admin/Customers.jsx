
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Shield,
  UserRound,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import CustomersTable from "../../components/CustomersTable";
import EditCustomerModal from "../../components/EditCustomerModal";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCustomers() {
    try {
      setError("");
      const response = await api.get("/users");
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const totalUsers = customers.length;
  const adminCount = customers.filter((c) => c.role === "Admin").length;
  const customerCount = customers.filter((c) => c.role === "Customer").length;

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        (customer.name || "").toLowerCase().includes(term) ||
        (customer.email || "").toLowerCase().includes(term) ||
        String(customer.id).includes(term);

      const matchesRole =
        filter === "all" || customer.role === filter;

      return matchesSearch && matchesRole;
    });
  }, [customers, search, filter]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-[#B95F3B]",
      bg: "bg-[#B95F3B]/10",
    },
    {
      label: "Customers",
      value: customerCount,
      icon: UserRound,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Administrators",
      value: adminCount,
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-7">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#B95F3B]">
            <Users size={17} />
            Restaurant Management
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
            Customers & Users
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage registered customers and administrator accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-[#25221F]">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <Icon size={23} className={stat.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white shadow-sm">
          <div className="border-b border-[#EEE9E1] p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#25221F]">
                  Registered Users
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Showing {filteredCustomers.length} of {totalUsers} users
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-64">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email or ID..."
                    className="w-full rounded-xl border border-[#E5DED3] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                  />
                </div>

                <div className="relative">
                  <SlidersHorizontal
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E5DED3] bg-white py-3 pl-10 pr-9 text-sm outline-none focus:border-[#B95F3B] sm:w-44"
                  >
                    <option value="all">All roles</option>
                    <option value="Customer">Customers</option>
                    <option value="Admin">Administrators</option>
                  </select>
                </div>

                <button
                  onClick={loadCustomers}
                  title="Refresh users"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DED3] px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#F5F0E7]"
                >
                  <RefreshCw size={17} />
                  <span className="sm:hidden">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:m-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <AlertCircle size={18} />
                {error}
              </div>
              <button
                onClick={loadCustomers}
                className="text-left text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
              <RefreshCw size={20} className="animate-spin" />
              Loading users...
            </div>
          ) : !error ? (
            <CustomersTable
              customers={filteredCustomers}
              loadCustomers={loadCustomers}
              setSelectedCustomer={setSelectedCustomer}
              setShowEditModal={setShowEditModal}
            />
          ) : null}
        </section>
      </div>

      <EditCustomerModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        customer={selectedCustomer}
        loadCustomers={loadCustomers}
      />
    </AdminLayout>
  );
}

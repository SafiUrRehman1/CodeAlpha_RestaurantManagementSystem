
import { useState } from "react";
import {
  Pencil,
  Trash2,
  Shield,
  UserRound,
  CalendarDays,
  Mail,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function CustomersTable({
  customers,
  loadCustomers,
  setSelectedCustomer,
  setShowEditModal,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteCustomer() {
    if (!customerToDelete) return;

    try {
      setError("");
      setDeleting(true);

      await api.delete(`/users/${customerToDelete.id}`);

      setShowDeleteModal(false);
      setCustomerToDelete(null);
      await loadCustomers();
    } catch (err) {
      console.error(err);
      const message = err.response?.data;
      setError(
        typeof message === "string"
          ? message
          : message?.message || "Failed to delete user."
      );
    } finally {
      setDeleting(false);
    }
  }

  function editCustomer(customer) {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  }

  function RoleBadge({ role }) {
    return role === "Admin" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
        <Shield size={14} />
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
        <UserRound size={14} />
        Customer
      </span>
    );
  }

  function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  }

  return (
    <div>
      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-6">
          {error}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="border-b border-[#EEE9E1] bg-[#FAF8F4] text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-14 text-center text-sm text-gray-500">
                  No users found. Try changing your search or filter.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-[#F0ECE6] transition hover:bg-[#FAF8F4]"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F0E7] font-bold text-[#B95F3B]">
                        {(customer.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#25221F]">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          User #{customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {customer.email}
                  </td>

                  <td className="px-6 py-5">
                    <RoleBadge role={customer.role} />
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => editCustomer(customer)}
                        title="Edit user"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-[#F5F0E7] hover:text-[#B95F3B]"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerToDelete(customer);
                          setShowDeleteModal(true);
                        }}
                        title="Delete user"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-4 md:hidden">
        {customers.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            No users found. Try changing your search or filter.
          </div>
        ) : (
          customers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-xl border border-[#EAE5DC] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5F0E7] text-lg font-bold text-[#B95F3B]">
                  {(customer.name || "?").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-bold text-[#25221F]">
                    {customer.name}
                  </h3>
                  <p className="mt-1 break-all text-sm text-gray-500">
                    <Mail size={14} className="mr-1 inline" />
                    {customer.email}
                  </p>
                  <div className="mt-2">
                    <RoleBadge role={customer.role} />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F0ECE6] pt-3">
                <p className="text-xs text-gray-500">
                  <CalendarDays size={14} className="mr-1 inline" />
                  Joined {formatDate(customer.createdAt)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => editCustomer(customer)}
                    className="rounded-lg bg-[#F5F0E7] p-2.5 text-[#B95F3B]"
                    aria-label="Edit user"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => {
                      setCustomerToDelete(customer);
                      setShowDeleteModal(true);
                    }}
                    className="rounded-lg bg-red-50 p-2.5 text-red-600"
                    aria-label="Delete user"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={
          customerToDelete
            ? `Are you sure you want to delete "${customerToDelete.name}"?`
            : ""
        }
        onCancel={() => {
          if (deleting) return;
          setShowDeleteModal(false);
          setCustomerToDelete(null);
        }}
        onConfirm={deleteCustomer}
      />
    </div>
  );
}

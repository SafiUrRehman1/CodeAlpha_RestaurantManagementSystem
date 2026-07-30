import { useState } from "react";
import { Pencil, Trash2, Shield, User } from "lucide-react";

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

  async function deleteCustomer() {

    try {

      await api.delete(`/users/${customerToDelete.id}`);

      setShowDeleteModal(false);
      setCustomerToDelete(null);

      loadCustomers();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to delete user."
      );

    }

  }

  return (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-4">Name</th>

            <th className="text-left py-4">Email</th>

            <th className="text-left py-4">Role</th>

            <th className="text-left py-4">Joined</th>

            <th className="text-center py-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {customers.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="text-center py-10 text-gray-500"
              >
                No users found.
              </td>

            </tr>

          ) : (

            customers.map(customer => (

              <tr
                key={customer.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="py-5 font-semibold">
                  {customer.name}
                </td>

                <td>
                  {customer.email}
                </td>

                <td>

                  {
                    customer.role === "Admin" ? (

                      <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">

                        <Shield size={16}/>

                        Admin

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                        <User size={16}/>

                        Customer

                      </span>

                    )
                  }

                </td>

                <td>

                  {
                    new Date(customer.createdAt)
                      .toLocaleDateString()
                  }

                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={()=>{
                        setSelectedCustomer(customer);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20}/>
                    </button>

                    <button
                      onClick={()=>{
                        setCustomerToDelete(customer);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20}/>
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={
          customerToDelete
          ? `Are you sure you want to delete "${customerToDelete.name}"?`
          : ""
        }
        onCancel={()=>{
          setShowDeleteModal(false);
          setCustomerToDelete(null);
        }}
        onConfirm={deleteCustomer}
      />

    </div>

  );

}
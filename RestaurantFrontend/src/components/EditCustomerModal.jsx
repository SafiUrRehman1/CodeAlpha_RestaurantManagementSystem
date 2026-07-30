import { useEffect, useState } from "react";
import api from "../services/api";

export default function EditCustomerModal({
  isOpen,
  onClose,
  customer,
  loadCustomers,
}) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");

  useEffect(() => {

    if (customer) {

      setName(customer.name);
      setEmail(customer.email);
      setRole(customer.role);

    }

  }, [customer]);

  async function handleSubmit(e) {

    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    if (!email.trim()) {
      alert("Email is required.");
      return;
    }

    try {

      await api.put(`/users/${customer.id}`, {
        name,
        email,
        role,
      });

      await loadCustomers();

      onClose();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Failed to update user."
      );

    }

  }

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold mb-6">

          Edit User

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Role
            </label>

            <select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            >

              <option value="User">
                User
              </option>

              <option value="Admin">
                Admin
              </option>

            </select>

          </div>

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

import { useEffect, useState } from "react";
import {
  X,
  UserRound,
  Mail,
  Shield,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";

export default function EditCustomerModal({
  isOpen,
  onClose,
  customer,
  loadCustomers,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Customer");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setEmail(customer.email || "");
      setRole(customer.role || "Customer");
      setError("");
    }
  }, [customer]);

  function handleClose() {
    if (saving) return;
    setError("");
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!["Admin", "Customer"].includes(role)) {
      setError("Please select a valid user role.");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/users/${customer.id}`, {
        name: name.trim(),
        email: email.trim(),
        role,
      });

      await loadCustomers();
      onClose();
    } catch (err) {
      console.error(err);
      const message = err.response?.data;

      setError(
        typeof message === "string"
          ? message
          : message?.message || "Failed to update user. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen || !customer) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#EEE9E1] p-5 sm:p-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#25221F]">
              Edit User
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update account information and permissions.
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#25221F]">
              Full Name
            </label>
            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full rounded-xl border border-[#E5DED3] py-3 pl-10 pr-4 outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#25221F]">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-xl border border-[#E5DED3] py-3 pl-10 pr-4 outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#25221F]">
              Account Role
            </label>
            <div className="relative">
              <Shield
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E5DED3] bg-white py-3 pl-10 pr-4 outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-400">
              Administrators have access to management features. Only assign
              this role to trusted accounts.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-[#E5DED3] px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B95F3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <LoaderCircle size={17} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import toast from "react-hot-toast";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      await api.put("/users/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data || "Unable to change password."
      );
    }

    setSaving(false);
  }

  return (
    <CustomerLayout>

      <div className="max-w-2xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          Change Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-xl p-8 space-y-6"
        >

          <div>

            <label className="block font-semibold mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            {saving ? "Updating..." : "Change Password"}
          </button>

        </form>

      </div>

    </CustomerLayout>
  );
}
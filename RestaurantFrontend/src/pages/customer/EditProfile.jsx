import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await api.get("/users/me");

      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load profile.");
    }

    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      await api.put("/users/me", {
        name,
        email,
      });

      toast.success("Profile updated successfully.");

      navigate("/customer/profile");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data || "Unable to update profile."
      );
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <CustomerLayout>
        <div className="text-center py-10">
          Loading...
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>

      <div className="max-w-2xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-xl p-8 space-y-6"
        >

          <div>

            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>

    </CustomerLayout>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await api.get("/users/me");
      setProfile(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load profile.");
    }

    setLoading(false);
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

      <div className="max-w-4xl mx-auto py-10 px-6">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <Link
            to="/customer/change-password"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Change Password
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow p-8">

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <h3 className="text-gray-500">
                Full Name
              </h3>

              <p className="text-xl font-semibold">
                {profile.name}
              </p>

            </div>

            <div>

              <h3 className="text-gray-500">
                Email
              </h3>

              <p className="text-xl">
                {profile.email}
              </p>

            </div>

            <div>

              <h3 className="text-gray-500">
                Role
              </h3>

              <p className="text-xl">
                {profile.role}
              </p>

            </div>

            <div>

              <h3 className="text-gray-500">
                Member Since
              </h3>

              <p className="text-xl">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>

            </div>

          </div>

          <div className="mt-10">

            <Link
              to="/customer/edit-profile"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Edit Profile
            </Link>

          </div>

        </div>

      </div>

    </CustomerLayout>
  );
}
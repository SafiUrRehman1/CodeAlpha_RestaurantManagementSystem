
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Pencil,
  LockKeyhole,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/users/me");
      setProfile(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  function getInitials(name) {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  function formatDate(dateString) {
    if (!dateString) return "Not available";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#F5F0E7] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B95F3B]">
              Account settings
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-[#77716A] sm:text-base">
              Manage your personal information and account security.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-[#E8E0D5] bg-white px-5 py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8E0D5] border-t-[#B95F3B]" />
              <p className="mt-4 text-sm text-[#77716A]">
                Loading your profile...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-14 text-center">
              <AlertCircle size={38} className="mx-auto text-red-500" />

              <h2 className="mt-4 text-xl font-semibold text-[#25221F]">
                Unable to load profile
              </h2>

              <p className="mt-2 text-sm text-[#77716A]">
                Please try again.
              </p>

              <button
                onClick={loadProfile}
                className="mt-6 rounded-lg bg-[#25221F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#403A34]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Profile Content */}
          {!loading && !error && profile && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* Profile Overview */}
              <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm lg:col-span-1">
                <div className="h-28 bg-[#25221F]" />

                <div className="px-6 pb-7">
                  <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#B95F3B] font-serif text-3xl font-bold text-white shadow-sm">
                    {getInitials(profile.name)}
                  </div>

                  <h2 className="mt-5 break-words font-serif text-2xl font-bold text-[#25221F]">
                    {profile.name || "User"}
                  </h2>

                  <p className="mt-1 break-all text-sm text-[#77716A]">
                    {profile.email}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#F5F0E7] px-3 py-2 text-xs font-semibold capitalize text-[#8B4A31]">
                    <ShieldCheck size={15} />
                    {profile.role || "Customer"}
                  </div>

                  <div className="mt-7 border-t border-[#EEE8DF] pt-5">
                    <p className="text-xs text-[#999087]">
                      Member since
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#25221F]">
                      <CalendarDays size={17} className="text-[#B95F3B]" />
                      {formatDate(profile.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-6 lg:col-span-2">

                <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#25221F]">
                        Personal Information
                      </h2>

                      <p className="mt-1 text-sm text-[#999087]">
                        Your registered account details.
                      </p>
                    </div>

                    <Link
                      to="/customer/edit-profile"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B95F3B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#984A2D]"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </Link>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4 rounded-xl bg-[#F9F6F0] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                        <UserRound size={20} className="text-[#B95F3B]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#999087]">
                          Full Name
                        </p>
                        <p className="mt-1 break-words font-semibold text-[#25221F]">
                          {profile.name || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-xl bg-[#F9F6F0] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                        <Mail size={20} className="text-[#B95F3B]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#999087]">
                          Email Address
                        </p>
                        <p className="mt-1 break-all font-semibold text-[#25221F]">
                          {profile.email || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-xl bg-[#F9F6F0] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                        <ShieldCheck size={20} className="text-[#B95F3B]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#999087]">
                          Account Role
                        </p>
                        <p className="mt-1 font-semibold capitalize text-[#25221F]">
                          {profile.role || "Customer"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Card */}
                <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5 shadow-sm sm:p-7">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E7]">
                        <LockKeyhole size={23} className="text-[#B95F3B]" />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#25221F]">
                          Account Security
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#77716A]">
                          Keep your account secure by updating your password regularly.
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/customer/change-password"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#D9D0C5] px-4 py-3 text-sm font-semibold text-[#25221F] transition hover:bg-[#F9F6F0]"
                    >
                      Change Password
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}

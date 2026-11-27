
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  Save,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setLoadError(false);

      const response = await api.get("/users/me");

      setName(response.data.name || "");
      setEmail(response.data.email || "");
    } catch (error) {
      console.error(error);
      setLoadError(true);
      toast.error("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      toast.error("Please complete all fields.");
      return;
    }

    try {
      setSaving(true);

      await api.put("/users/me", {
        name: trimmedName,
        email: trimmedEmail,
      });

      toast.success("Profile updated successfully.");
      navigate("/customer/profile");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#F5F0E7] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">

          <Link
            to="/customer/profile"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#77716A] transition hover:text-[#B95F3B]"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B95F3B]">
              Account settings
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Edit Profile
            </h1>

            <p className="mt-2 text-sm text-[#77716A] sm:text-base">
              Update your personal information.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-[#E8E0D5] bg-white px-5 py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8E0D5] border-t-[#B95F3B]" />
              <p className="mt-4 text-sm text-[#77716A]">
                Loading your information...
              </p>
            </div>
          )}

          {!loading && loadError && (
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-14 text-center">
              <AlertCircle size={38} className="mx-auto text-red-500" />

              <h2 className="mt-4 text-xl font-semibold text-[#25221F]">
                Unable to load profile
              </h2>

              <p className="mt-2 text-sm text-[#77716A]">
                Please try loading your information again.
              </p>

              <button
                onClick={loadProfile}
                className="mt-6 rounded-lg bg-[#25221F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#403A34]"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">

              <div className="bg-[#25221F] px-5 py-7 sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <UserRound size={25} className="text-[#E5A184]" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm text-white/65">
                      Keep your account details up to date.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 p-5 sm:p-8"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#25221F]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69D92]"
                    />

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      className="w-full rounded-xl border border-[#E5DED4] bg-[#FCFAF7] py-3.5 pl-12 pr-4 text-sm text-[#25221F] outline-none transition placeholder:text-[#AAA198] focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#25221F]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69D92]"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      required
                      maxLength={254}
                      className="w-full rounded-xl border border-[#E5DED4] bg-[#FCFAF7] py-3.5 pl-12 pr-4 text-sm text-[#25221F] outline-none transition placeholder:text-[#AAA198] focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-[#F5F0E7] p-4">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-[#B95F3B]"
                  />

                  <p className="text-xs leading-5 text-[#77716A]">
                    Your updated information will be saved to your restaurant
                    account. You may need to sign in again if your account
                    credentials or authentication details change.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#EEE8DF] pt-6 sm:flex-row sm:justify-end">
                  <Link
                    to="/customer/profile"
                    className="inline-flex items-center justify-center rounded-lg border border-[#D9D0C5] px-6 py-3 text-sm font-semibold text-[#25221F] transition hover:bg-[#F9F6F0]"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B95F3B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#984A2D] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </CustomerLayout>
  );
}

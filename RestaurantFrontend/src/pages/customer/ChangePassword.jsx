
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";


function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  setVisible,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-[#25221F]"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69D92]"
        />

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          required
          className="w-full rounded-xl border border-[#E5DED4] bg-[#FCFAF7] py-3.5 pl-11 pr-12 text-sm text-[#25221F] outline-none transition placeholder:text-[#AAA198] focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999087] transition hover:text-[#B95F3B]"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}


export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

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
      console.error(error);

      toast.error(
        error.response?.data || "Unable to change password."
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
              Account security
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#25221F] sm:text-4xl">
              Change Password
            </h1>

            <p className="mt-2 text-sm text-[#77716A] sm:text-base">
              Update your password to help keep your account secure.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">

            <div className="bg-[#25221F] px-5 py-7 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <KeyRound size={25} className="text-[#E5A184]" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Update Your Password
                  </h2>
                  <p className="mt-1 text-sm text-white/65">
                    Enter your current password and choose a new one.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">

              <PasswordField
                id="currentPassword"
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrent}
                setVisible={setShowCurrent}
                placeholder="Enter your current password"
              />

              <PasswordField
                id="newPassword"
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                visible={showNew}
                setVisible={setShowNew}
                placeholder="Enter your new password"
              />

              <p className="-mt-4 text-xs text-[#999087]">
                Use at least 8 characters for your new password.
              </p>

              <PasswordField
                id="confirmPassword"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirm}
                setVisible={setShowConfirm}
                placeholder="Re-enter your new password"
              />

              <div className="flex items-start gap-3 rounded-xl bg-[#F5F0E7] p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#B95F3B]"
                />

                <p className="text-xs leading-5 text-[#77716A]">
                  Never share your password with anyone. Use a unique
                  password that you don't use on other websites.
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
                  <LockKeyhole size={17} />
                  {saving ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}


import { useState } from "react";
import { X, Armchair, Users, LoaderCircle } from "lucide-react";
import api from "../services/api";

export default function AddTableModal({ isOpen, onClose, loadTables }) {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    if (saving) return;
    setTableNumber("");
    setCapacity("");
    setError("");
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const number = Number(tableNumber);
    const guests = Number(capacity);

    if (!Number.isInteger(number) || number <= 0) {
      setError("Enter a valid table number greater than zero.");
      return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
      setError("Capacity must be between 1 and 20.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/tables", {
        tableNumber: number,
        capacity: guests,
      });

      await loadTables();
      setTableNumber("");
      setCapacity("");
      onClose();
    } catch (err) {
      console.error(err);
      const message = err.response?.data;
      setError(
        typeof message === "string"
          ? message
          : message?.message || "Failed to create table. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

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
              Add New Table
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the table details below.
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
              Table Number
            </label>
            <div className="relative">
              <Armchair
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                min="1"
                step="1"
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 12"
                className="w-full rounded-xl border border-[#E5DED3] py-3 pl-10 pr-4 outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#25221F]">
              Seating Capacity
            </label>
            <div className="relative">
              <Users
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                min="1"
                max="20"
                step="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 4"
                className="w-full rounded-xl border border-[#E5DED3] py-3 pl-10 pr-4 outline-none transition focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Enter a capacity between 1 and 20 guests.
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
              {saving ? "Adding..." : "Add Table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

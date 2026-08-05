import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function Reservations() {
  const [tables, setTables] = useState([]);

  const [tableId, setTableId] = useState("");

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    try {
      const response = await api.get("/tables/available");

      setTables(response.data);
    } catch (error) {
      console.log(error);

      toast.error("Unable to load tables.");
    }
  }

  async function handleReserve(e) {
    e.preventDefault();

    if (!tableId || !date || !time) {
      toast.error("Please complete all fields.");
      return;
    }

    try {
      const reservationTime = `${date}T${time}:00`;

      await api.post("/reservations", {
        tableId: Number(tableId),
        reservationTime,
      });

      toast.success("Reservation created successfully.");
      navigate("/customer/my-reservations");
      
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data || "Reservation failed."
      );
    }
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          Reserve a Table
        </h1>

        <form
          onSubmit={handleReserve}
          className="bg-white shadow rounded-xl p-8 space-y-6"
        >
          <div>

            <label className="font-semibold block mb-2">
              Select Table
            </label>

            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Select a table
              </option>

              {tables.map((table) => (
                <option
                  key={table.id}
                  value={table.id}
                >
                  Table {table.tableNumber}
                  {" - "}
                  {table.capacity} Persons
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="font-semibold block mb-2">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="font-semibold block mb-2">
              Time
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            Reserve Table
          </button>

        </form>

      </div>
    </CustomerLayout>
  );
}
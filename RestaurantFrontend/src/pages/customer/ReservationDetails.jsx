import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservation();
  }, []);

  async function cancelReservation() {
  if (!window.confirm("Are you sure you want to cancel this reservation?")) {
    return;
  }

  try {
    const response = await api.delete(
      `/reservations/my-reservations/${reservation.id}`
    );

    toast.success(response.data.message);

navigate("/customer/my-reservations");
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data || "Unable to cancel reservation."
    );
  }
}

  async function loadReservation() {
    try {
      const response = await api.get(`/reservations/my-reservations/${id}`);

      setReservation(response.data);
    } catch (error) {
      console.log(error);

      toast.error("Unable to load reservation.");
    }

    setLoading(false);
  }

  function badgeColor(status) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-green-100 text-green-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
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

  if (!reservation) {
    return (
      <CustomerLayout>
        <div className="text-center py-10">
          Reservation not found.
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>

      <div className="max-w-4xl mx-auto py-10 px-6">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Reservation Details
          </h1>

          <Link
            to="/customer/my-reservations"
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
          >
            Back
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <h3 className="text-gray-500">
                Reservation ID
              </h3>

              <p className="text-xl font-semibold">
                #{reservation.id}
              </p>
            </div>

            {reservation.status === "Pending" && (
  <div className="mt-8 flex justify-end">

    <button
      onClick={cancelReservation}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
    >
      Cancel Reservation
    </button>

  </div>
)}
<div>
  <h3 className="text-gray-500 mb-3">
    Status
  </h3>

  <span
    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(
      reservation.status
    )}`}
  >
    {reservation.status}
  </span>
</div>

            <div>
              <h3 className="text-gray-500">
                Table Number
              </h3>

              <p className="text-xl">
                Table {reservation.tableNumber}
              </p>
            </div>

            <div>
              <h3 className="text-gray-500">
                Reservation Time
              </h3>

              <p className="text-xl">
                {new Date(
                  reservation.reservationTime
                ).toLocaleString()}
              </p>
            </div>

          </div>

        </div>

      </div>

    </CustomerLayout>
  );
}
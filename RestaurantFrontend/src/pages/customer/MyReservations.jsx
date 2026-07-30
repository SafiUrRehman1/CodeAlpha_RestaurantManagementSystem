import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";


export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      const response = await api.get("/reservations/my-reservations");
      setReservations(response.data);
    } catch (error) {
      console.log(error);
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

return (
  <CustomerLayout>

    <div className="max-w-6xl mx-auto py-10 px-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          My Reservations
        </h1>

        <Link
          to="/customer/reserve-table"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          + Reserve New Table
        </Link>

      </div>

        {loading ? (
          <div className="text-center py-10">
            Loading...
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">

            <h2 className="text-2xl font-semibold mb-3">
              No Reservations Yet
            </h2>

            <p className="text-gray-500">
              Reserve your first table.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {reservations.map((reservation) => (

              <div
                key={reservation.id}
                className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
              >

                <div>

                  <h2 className="text-xl font-bold">
                    Reservation #{reservation.id}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Table {reservation.tableId}
                  </p>

                  <p className="text-gray-500">
                    {new Date(
                      reservation.reservationTime
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="text-right">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>

                  <br />

                  <Link
                    to={`/customer/my-reservations/${reservation.id}`}
                    className="inline-block mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
                  >
                    View Details
                  </Link>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </CustomerLayout>
  );
}
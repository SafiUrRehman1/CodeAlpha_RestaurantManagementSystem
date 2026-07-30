import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function Home() {
  const navigate = useNavigate();

  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  async function loadFeaturedItems() {
    try {
      const response = await api.get("/menu");

      setFeaturedItems(response.data.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <CustomerLayout>

      {/* Hero Section */}

      <section className="bg-orange-500 text-white">

        <div className="max-w-7xl mx-auto px-8 py-24">

          <h1 className="text-6xl font-bold leading-tight">

            Delicious Food

            <br />

            Delivered Fresh

          </h1>

          <p className="mt-6 text-xl max-w-xl">

            Explore our delicious menu, reserve your table,
            and enjoy an unforgettable dining experience.

          </p>

          <div className="mt-10 flex gap-4">

            <button
              onClick={() => navigate("/customer/menu")}
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-100"
            >
              Order Now
            </button>

            <button
            onClick={() => navigate("/customer/reservations")}
              className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-orange-600"
            >
              Reserve Table
            </button>

          </div>

        </div>

      </section>

      {/* Featured Items */}

      <section className="max-w-7xl mx-auto px-8 py-16">

        <h2 className="text-4xl font-bold text-center mb-12">

          Featured Menu

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {featuredItems.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5"
            >

              <img
                src={
                  item.imageUrl ||
                  "https://placehold.co/400x250?text=Food"
                }
                alt={item.itemName}
                className="w-full h-48 object-cover rounded-xl"
              />

              <h3 className="text-xl font-bold mt-5">

                {item.itemName}

              </h3>

              <p className="text-gray-500 mt-2">

                {item.description}

              </p>

              <div className="mt-5 flex justify-between items-center">

                <span className="text-orange-600 text-xl font-bold">

                  Rs. {item.price}

                </span>

                <button
                onClick={() => navigate("/customer/menu")}
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
                >
                  View
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Why Choose Us */}

      <section className="bg-gray-100 py-20">

        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-4xl font-bold text-center mb-14">

            Why Choose Us?

          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white rounded-2xl p-8 shadow">

              <h3 className="text-2xl font-bold mb-4">

                Fresh Ingredients

              </h3>

              <p className="text-gray-600">

                Every meal is prepared using fresh and
                high-quality ingredients.

              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 shadow">

              <h3 className="text-2xl font-bold mb-4">

                Fast Delivery

              </h3>

              <p className="text-gray-600">

                Get your favorite meals delivered quickly
                to your doorstep.

              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 shadow">

              <h3 className="text-2xl font-bold mb-4">

                Best Taste

              </h3>

              <p className="text-gray-600">

                Our experienced chefs prepare every meal
                with exceptional care.

              </p>

            </div>

          </div>

        </div>

      </section>

    </CustomerLayout>
  );
}
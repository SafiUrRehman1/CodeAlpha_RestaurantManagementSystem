
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, ChefHat, Utensils, Star } from "lucide-react";

import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function Home() {
  const navigate = useNavigate();

  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  async function loadFeaturedItems() {
    try {
      const response = await api.get("/menu");
      const items = Array.isArray(response.data) ? response.data : [];
      setFeaturedItems(items.slice(0, 4));
    } catch (error) {
      console.error("Failed to load featured menu:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomerLayout>
      <div className="bg-[#F5F0E7]">

        {/* HERO SECTION */}

        <section className="bg-[#25221F] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

            <div>
              <div className="flex items-center gap-3 mb-7">
                <span className="w-10 h-[1px] bg-[#C77B58]" />
                <span className="uppercase tracking-[4px] text-xs font-semibold text-[#D99B79]">
                  Welcome to our restaurant
                </span>
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl leading-[1.12] font-bold text-[#F5F0E7]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Good Food.
                <br />
                <span className="text-[#D58A65]">Great Moments.</span>
              </h1>

              <p className="mt-7 text-base md:text-lg text-[#C9BFB4] leading-8 max-w-lg">
                Discover delicious meals prepared with care, fresh
                ingredients, and a passion for unforgettable dining.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/customer/menu")}
                  className="bg-[#B95F3B] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#98472B] transition flex items-center gap-3"
                >
                  Explore Menu
                  <ArrowRight size={19} />
                </button>

                <button
                  onClick={() => navigate("/customer/reserve-table")}
                  className="border border-[#8E8174] text-[#F5F0E7] px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#25221F] transition"
                >
                  Reserve a Table
                </button>
              </div>

              <div className="mt-12 flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <ChefHat className="text-[#D58A65]" size={25} />
                  <div>
                    <p className="font-semibold text-sm">Freshly Prepared</p>
                    <p className="text-xs text-[#AFA49A]">Made with care</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-[#D58A65]" size={25} />
                  <div>
                    <p className="font-semibold text-sm">Easy Ordering</p>
                    <p className="text-xs text-[#AFA49A]">Simple and convenient</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO IMAGE */}

            <div className="relative">
              <div className="absolute -inset-4 border border-[#756052] rounded-3xl rotate-3" />

              <div className="relative rounded-3xl overflow-hidden bg-[#514238] aspect-[5/4]">
                <img
                  src={
                    featuredItems[0]?.imageUrl ||
                    "https://placehold.co/800x640/514238/F5F0E7?text=Our+Food"
                  }
                  alt="Featured restaurant dish"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 p-7">
                  <p className="text-xs uppercase tracking-[3px] text-[#E9B28F]">
                    Our Kitchen
                  </p>
                  <h2 className="text-3xl text-white mt-2">
                    Made to Delight
                  </h2>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 bg-[#F5F0E7] text-[#25221F] rounded-xl shadow-xl p-4 hidden md:block">
                <div className="flex items-center gap-2">
                  <Utensils className="text-[#B95F3B]" size={21} />
                  <span className="font-semibold text-sm">A Taste Worth Sharing</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURED MENU */}

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">

          <div className="flex flex-wrap justify-between items-end gap-5 mb-12">
            <div>
              <p className="uppercase tracking-[3px] text-xs font-bold text-[#B95F3B] mb-3">
                From Our Kitchen
              </p>

              <h2 className="text-4xl md:text-5xl font-bold">
                Featured Dishes
              </h2>

              <p className="text-[#81776D] mt-3">
                Discover some of our favorites.
              </p>
            </div>

            <button
              onClick={() => navigate("/customer/menu")}
              className="text-[#B95F3B] font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              View Full Menu
              <ArrowRight size={18} />
            </button>
          </div>

          {loading ? (
            <p className="text-center text-[#81776D] py-12">
              Loading our delicious menu...
            </p>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Utensils size={35} className="mx-auto text-[#B95F3B] mb-4" />
              <p className="text-[#81776D]">
                No featured dishes are available right now.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {featuredItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E9E1D7] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-52 overflow-hidden bg-[#E9E1D7]">
                    <img
                      src={
                        item.imageUrl ||
                        "https://placehold.co/500x400/F5F0E7/25221F?text=Food"
                      }
                      alt={item.itemName}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1 text-[#B95F3B] mb-3">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-semibold">Featured</span>
                    </div>

                    <h3 className="text-xl font-bold">
                      {item.itemName}
                    </h3>

                    <p className="text-sm text-[#81776D] mt-2 line-clamp-2 min-h-10">
                      {item.description || "Prepared fresh in our kitchen."}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-lg font-bold text-[#B95F3B]">
                        Rs. {item.price}
                      </span>

                      <button
                        onClick={() => navigate("/customer/menu")}
                        className="bg-[#25221F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#B95F3B] transition"
                      >
                        View Dish
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </section>

        {/* WHY CHOOSE US */}

        <section className="bg-[#EDE5D9] py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10">

            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="uppercase tracking-[3px] text-xs font-bold text-[#B95F3B] mb-3">
                The Difference
              </p>

              <h2 className="text-4xl md:text-5xl font-bold">
                More Than Just a Meal
              </h2>

              <p className="text-[#81776D] mt-4">
                Every detail matters when it comes to a great dining experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-7">

              {[
                {
                  number: "01",
                  title: "Fresh Ingredients",
                  description:
                    "We believe great food starts with carefully selected ingredients.",
                },
                {
                  number: "02",
                  title: "Made With Care",
                  description:
                    "Our dishes are prepared with attention to flavor and quality.",
                },
                {
                  number: "03",
                  title: "Easy Experience",
                  description:
                    "Browse the menu, place orders, and reserve your table with ease.",
                },
              ].map((feature) => (
                <div
                  key={feature.number}
                  className="bg-[#F9F6F0] p-8 rounded-2xl border border-[#E3D8CA]"
                >
                  <span className="text-[#B95F3B] text-sm font-bold tracking-widest">
                    {feature.number}
                  </span>

                  <h3 className="text-2xl font-bold mt-5 mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-[#81776D] leading-7">
                    {feature.description}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}

        <section className="bg-[#25221F] px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#D58A65] uppercase tracking-[3px] text-xs font-bold">
              Your Table Awaits
            </p>

            <h2 className="text-4xl md:text-5xl text-[#F5F0E7] mt-4">
              Make Your Next Meal Special
            </h2>

            <p className="text-[#C9BFB4] mt-5 leading-7">
              Explore our menu or book a table for your next dining experience.
            </p>

            <button
              onClick={() => navigate("/customer/reserve-table")}
              className="mt-8 bg-[#B95F3B] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#98472B] transition"
            >
              Book Your Table
            </button>
          </div>
        </section>

      </div>
    </CustomerLayout>
  );
}

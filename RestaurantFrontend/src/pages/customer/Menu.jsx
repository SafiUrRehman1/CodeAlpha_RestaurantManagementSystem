
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Search,
  Utensils,
  ArrowRight,
  LoaderCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useCart } from "../../context/CartContext";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/menu");

      setMenuItems(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Failed to load menu:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const name = (item.itemName || "").toLowerCase();
      const matchesSearch = name.includes(search.toLowerCase());

      const matchesAvailability =
        !showAvailableOnly || item.isAvailable !== false;

      return matchesSearch && matchesAvailability;
    });
  }, [menuItems, search, showAvailableOnly]);

  function handleAdd(item) {
    if (item.isAvailable === false) {
      toast.error("This item is currently unavailable");
      return;
    }

    addToCart(item);
    toast.success(`${item.itemName} added to cart`);
  }

  return (
    <CustomerLayout>
      <div className="bg-[#F5F0E7] min-h-screen">

        {/* PAGE HERO */}

        <section className="bg-[#25221F] text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">

            <p className="text-[#D58A65] uppercase tracking-[4px] text-xs font-bold mb-5">
              Discover Our Flavors
            </p>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-[#F5F0E7]">
                  Our Menu
                </h1>

                <p className="text-[#C9BFB4] mt-5 max-w-xl leading-7">
                  Explore our selection of delicious dishes,
                  prepared with care and made to satisfy every craving.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[#D58A65]">
                <Utensils size={25} />
                <span className="text-sm font-semibold tracking-wide">
                  Freshly Prepared
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* MENU CONTENT */}

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">

          {/* SEARCH AND FILTER */}

          <div className="flex flex-col md:flex-row gap-5 justify-between md:items-center mb-10">

            <div>
              <h2 className="text-3xl font-bold">
                Explore Dishes
              </h2>

              <p className="text-[#81776D] mt-2 text-sm">
                Find something delicious for your next meal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative min-w-0 sm:w-72">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#81776D]"
                  size={19}
                />

                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-[#E9E1D7] rounded-xl pl-11 pr-10 py-3.5 outline-none focus:border-[#B95F3B] focus:ring-2 focus:ring-[#B95F3B]/10 transition text-sm"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81776D] hover:text-[#B95F3B]"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className={`px-5 py-3.5 rounded-xl text-sm font-semibold border transition ${
                  showAvailableOnly
                    ? "bg-[#B95F3B] text-white border-[#B95F3B]"
                    : "bg-white text-[#51483F] border-[#E9E1D7] hover:border-[#B95F3B]"
                }`}
              >
                {showAvailableOnly ? "Available Only ✓" : "Available Only"}
              </button>

            </div>
          </div>

          {/* RESULT COUNT */}

          {!loading && !error && (
            <div className="flex items-center justify-between mb-7">
              <p className="text-sm text-[#81776D]">
                Showing <strong className="text-[#25221F]">
                  {filteredItems.length}
                </strong> dishes
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-sm text-[#B95F3B] font-semibold"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="flex flex-col items-center py-24">
              <LoaderCircle
                size={35}
                className="animate-spin text-[#B95F3B]"
              />
              <p className="mt-5 text-[#81776D]">
                Preparing our menu...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="bg-white rounded-2xl border border-[#E9E1D7] p-12 text-center">
              <Utensils
                size={35}
                className="mx-auto text-[#B95F3B] mb-4"
              />

              <h3 className="text-2xl font-bold">
                Unable to load menu
              </h3>

              <p className="text-[#81776D] mt-3">
                Something went wrong while loading the dishes.
                Please try again.
              </p>

              <button
                onClick={loadMenu}
                className="mt-6 bg-[#B95F3B] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[#98472B] transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* MENU GRID */}

          {!loading && !error && filteredItems.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E9E1D7] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  {/* FOOD IMAGE */}

                  <div className="relative h-56 overflow-hidden bg-[#E9E1D7]">

                    <img
                      src={
                        item.imageUrl ||
                        "https://placehold.co/600x450/F5F0E7/25221F?text=Restaurant+Dish"
                      }
                      alt={item.itemName || "Restaurant dish"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    <span
                      className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        item.isAvailable === false
                          ? "bg-red-100 text-red-700"
                          : "bg-[#F5F0E7] text-[#98472B]"
                      }`}
                    >
                      {item.isAvailable === false
                        ? "Unavailable"
                        : "Available"}
                    </span>

                  </div>

                  {/* FOOD DETAILS */}

                  <div className="p-5">

                    <h3 className="text-xl font-bold text-[#25221F] truncate">
                      {item.itemName}
                    </h3>

                    <p className="text-sm text-[#81776D] mt-2 min-h-10 line-clamp-2">
                      {item.description ||
                        "Deliciously prepared and freshly served."}
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E9E1D7]">

                      <div>
                        <p className="text-xs text-[#81776D]">
                          Price
                        </p>

                        <p className="text-xl font-bold text-[#B95F3B] mt-1">
                          Rs. {Number(item.price).toLocaleString("en-PK")}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAdd(item)}
                        disabled={item.isAvailable === false}
                        className="flex items-center gap-2 bg-[#25221F] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#B95F3B] transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={17} />
                        Add
                      </button>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}

          {/* EMPTY STATE */}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#E9E1D7] text-center py-20 px-5">

              <Search
                size={38}
                className="mx-auto text-[#B95F3B] mb-5"
              />

              <h3 className="text-2xl font-bold">
                No dishes found
              </h3>

              <p className="text-[#81776D] mt-3">
                Try searching with a different dish name.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setShowAvailableOnly(false);
                }}
                className="mt-6 text-[#B95F3B] font-semibold flex items-center gap-2 mx-auto"
              >
                Clear Filters
                <ArrowRight size={17} />
              </button>

            </div>
          )}

        </section>

      </div>
    </CustomerLayout>
  );
}

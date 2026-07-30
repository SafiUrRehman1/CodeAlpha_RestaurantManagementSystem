import { useEffect, useState } from "react";
import { ShoppingCart, Search } from "lucide-react";

import api from "../../services/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    loadMenu();
  }, []);

  useEffect(() => {
    const filtered = menuItems.filter((item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredItems(filtered);
  }, [search, menuItems]);

  async function loadMenu() {
    try {
      const response = await api.get("/menu");

      setMenuItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleAdd(item) {
    addToCart(item);
    toast.success(`${item.itemName} added to cart`);
  }

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Our Menu
            </h1>

            <p className="text-gray-500 mt-2">
              Delicious meals prepared fresh every day.
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="relative mb-8">

          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
          />

        </div>

        {/* Menu Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredItems.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >

              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700"
                alt={item.itemName}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {item.itemName}
                </h2>

                <p className="text-orange-600 font-bold text-xl mt-4">
                  Rs. {Number(item.price).toLocaleString()}
                </p>

                <button
                  onClick={() => handleAdd(item)}
                  className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
                >
                  <ShoppingCart size={20} />

                  Add to Cart
                </button>

              </div>

            </div>

          ))}

        </div>

        {filteredItems.length === 0 && (
          <div className="text-center mt-20 text-gray-500 text-xl">
            No menu items found.
          </div>
        )}

      </div>
    </CustomerLayout>
  );
}
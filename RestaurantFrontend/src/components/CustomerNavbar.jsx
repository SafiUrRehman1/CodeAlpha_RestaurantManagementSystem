import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { getUser, removeToken } from "../utils/auth";

export default function CustomerNavbar() {
  const navigate = useNavigate();

  const user = getUser();

  const username =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Customer";

  function handleLogout() {
    removeToken();
    navigate("/", { replace: true });
  }

  const navClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-orange-600 font-semibold"
        : "text-gray-700 hover:text-orange-600"
    }`;

  return (
    <header className="bg-white shadow">

      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-orange-600">
          🍽 Restaurant
        </h1>

        <nav className="flex items-center gap-8">

          <NavLink to="/customer/home" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/customer/menu" className={navClass}>
            Menu
          </NavLink>

          <NavLink to="/customer/my-reservations" className={navClass}>
            Reservations
          </NavLink>

          <NavLink to="/customer/my-orders" className={navClass}>
            My Orders
          </NavLink>

          <NavLink to="/customer/profile" className={navClass}>
            Profile
          </NavLink>

        </nav>

        <div className="flex items-center gap-5">

          <button
            onClick={() => navigate("/customer/cart")}
            className="relative hover:text-orange-600"
          >
            <ShoppingCart size={24} />
          </button>

          <div className="flex items-center gap-2">

            <User size={20} />

            <span className="font-medium">
              {username}
            </span>

          </div>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut size={22} />
          </button>

        </div>

      </div>

    </header>
  );
}
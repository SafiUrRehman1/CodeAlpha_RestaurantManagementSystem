
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Utensils,
  ChevronDown,
} from "lucide-react";
import { getUser, removeToken } from "../utils/auth";

export default function CustomerNavbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = getUser();

  const username =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Customer";

  function handleLogout() {
    removeToken();
    navigate("/", { replace: true });
  }

  const links = [
    { name: "Home", path: "/customer/home" },
    { name: "Menu", path: "/customer/menu" },
    { name: "Reservations", path: "/customer/my-reservations" },
    { name: "My Orders", path: "/customer/my-orders" },
  ];

  const navClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? "text-[#B95F3B]"
        : "text-[#51483F] hover:text-[#B95F3B]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E7]/95 backdrop-blur-md border-b border-[#E9E1D7]">

      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[76px] flex items-center justify-between">

        {/* BRAND */}

        <button
          onClick={() => navigate("/customer/home")}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-xl bg-[#25221F] flex items-center justify-center text-white">
            <Utensils size={23} />
          </div>

          <div className="text-left">
            <h1 className="font-bold text-xl md:text-2xl text-[#25221F] leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}>
              Restaurant
            </h1>
            <p className="text-[10px] tracking-[3px] uppercase text-[#B95F3B] font-semibold">
              Management System
            </p>
          </div>
        </button>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={navClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}

        <div className="hidden lg:flex items-center gap-5">

          <button
            onClick={() => navigate("/customer/cart")}
            className="relative p-2 text-[#39332E] hover:text-[#B95F3B] transition"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={22} />
          </button>

          <NavLink
            to="/customer/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#E9E1D7] hover:border-[#B95F3B] transition"
          >
            <div className="w-8 h-8 rounded-full bg-[#EBD8C9] flex items-center justify-center">
              <User size={17} className="text-[#98472B]" />
            </div>

            <span className="text-sm font-semibold text-[#39332E] max-w-[110px] truncate">
              {username}
            </span>

            <ChevronDown size={15} className="text-[#81776D]" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="text-[#81776D] hover:text-red-600 transition"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={21} />
          </button>
        </div>

        {/* MOBILE ACTIONS */}

        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => navigate("/customer/cart")}
            className="text-[#39332E]"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={22} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#25221F]"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E9E1D7] bg-[#F5F0E7] px-6 py-5">

          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#B95F3B]/10 text-[#B95F3B]"
                      : "text-[#51483F] hover:bg-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <NavLink
              to="/customer/profile"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-semibold text-[#51483F] hover:bg-white"
            >
              My Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 text-sm font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>

        </div>
      )}

    </header>
  );
}

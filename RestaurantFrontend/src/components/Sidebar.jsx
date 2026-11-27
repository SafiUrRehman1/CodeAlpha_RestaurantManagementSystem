
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Boxes,
  CalendarDays,
  Users,
  LogOut,
  Table2,
  ChefHat,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    navigate("/", { replace: true });
  }

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Menu Management",
      path: "/admin/menu",
      icon: UtensilsCrossed,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: Boxes,
    },
    {
      name: "Tables",
      path: "/admin/tables",
      icon: Table2,
    },
    {
      name: "Reservations",
      path: "/admin/reservations",
      icon: CalendarDays,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
  ];

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#25221F] text-white">

      {/* Brand */}
      <div className="border-b border-white/10 px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B95F3B]">
            <ChefHat size={25} className="text-white" />
          </div>

          <div>
            <h1 className="font-serif text-xl font-bold tracking-wide">
              Restaurant
            </h1>
            <p className="mt-0.5 text-xs text-white/50">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 pb-2 pt-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Main Menu
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#B95F3B] text-white shadow-lg shadow-black/10"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-4 rounded-xl bg-white/5 p-4">
          <p className="text-xs font-semibold text-white/80">
            Admin Workspace
          </p>
          <p className="mt-1 text-xs text-white/40">
            Manage your restaurant
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Boxes,
  CalendarDays,
  Users,
  LogOut,
  Table2,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    navigate("/", { replace: true });
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-4 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-200 hover:bg-slate-800"
    }`;

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white shadow-xl flex flex-col">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          🍽 Restaurant
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Management System
        </p>
      </div>

      <nav className="mt-6 flex-1 flex flex-col">

        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          <ShoppingCart size={20} />
          Orders
        </NavLink>

        <NavLink to="/admin/menu" className={linkClass}>
          <UtensilsCrossed size={20} />
          Menu
        </NavLink>

        <NavLink to="/admin/inventory" className={linkClass}>
          <Boxes size={20} />
          Inventory
        </NavLink>

        
        <NavLink to="/admin/tables" className={linkClass}>
          <Table2 size={20} />
          Tables
        </NavLink>

        <NavLink to="/admin/reservations" className={linkClass}>
          <CalendarDays size={20} />
          Reservations
        </NavLink>

        <NavLink to="/admin/customers" className={linkClass}>
          <Users size={20} />
          Customers
        </NavLink>

      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 rounded-lg py-3 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}

import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AdminNavbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  let username = "Admin";

  if (token) {
    try {
      const decoded = jwtDecode(token);

      username =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] || "Admin";
    } catch (error) {
      console.error("Unable to decode admin token:", error);
    }
  }

  const pageNames = {
    "/admin/dashboard": "Dashboard",
    "/admin/orders": "Orders",
    "/admin/menu": "Menu Management",
    "/admin/inventory": "Inventory",
    "/admin/tables": "Tables",
    "/admin/reservations": "Reservations",
    "/admin/customers": "Customers",
  };

  const currentPage =
    location.pathname.startsWith("/admin/orders/")
      ? "Order Details"
      : pageNames[location.pathname] || "Admin Panel";

  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-[#999087]">
          Admin Workspace / {currentPage}
        </p>

        <h2 className="mt-1 truncate text-base font-bold text-[#25221F] sm:text-lg">
          Welcome back, {username}
        </h2>
      </div>

      <div className="hidden shrink-0 items-center gap-2 rounded-full bg-[#F5F0E7] px-3 py-2 sm:flex">
        <ShieldCheck size={17} className="text-[#B95F3B]" />
        <span className="text-xs font-semibold text-[#66594F]">
          Administrator
        </span>
      </div>
    </div>
  );
}

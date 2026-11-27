
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F0E7] lg:flex">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-4 border-b border-[#E8E0D5] bg-white px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E8E0D5] text-[#25221F] transition hover:bg-[#F5F0E7] lg:hidden"
          >
            {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <div className="min-w-0 flex-1">
            <AdminNavbar />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

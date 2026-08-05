import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
import CustomerNavbar from "../components/CustomerNavbar";
import CustomerFooter from "../components/CustomerFooter";

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <CustomerNavbar />

      <main className="flex-1">
        {children}
      </main>

      <CustomerFooter />

    </div>
  );
}
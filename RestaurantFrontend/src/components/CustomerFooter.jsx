export default function CustomerFooter() {
  return (
    <footer className="bg-slate-900 text-white py-6 mt-10">

      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">

        <h2 className="text-xl font-bold">
          🍽 Restaurant Management System
        </h2>

        <p className="text-gray-400">
          © {new Date().getFullYear()} All Rights Reserved
        </p>

      </div>

    </footer>
  );
}
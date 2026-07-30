export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-10">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-2xl font-bold">
          🍽 Restaurant Management System
        </h2>

        <p className="text-slate-400 mt-2">
          Delicious food. Fast delivery. Easy reservations.
        </p>

        <hr className="border-slate-700 my-6" />

        <div className="flex justify-between items-center flex-wrap gap-4">

          <p className="text-slate-400">
            © 2026 Restaurant Management System
          </p>

          <p className="text-slate-400">
            Built with ASP.NET Core + React
          </p>

        </div>

      </div>

    </footer>
  );
}
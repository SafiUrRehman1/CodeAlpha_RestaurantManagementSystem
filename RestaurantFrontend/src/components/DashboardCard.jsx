export default function DashboardCard({
  title,
  value,
  icon,
  color = "text-black",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-4 ${color}`}>
            {value}
          </h2>

        </div>

        <div className="text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  );
}
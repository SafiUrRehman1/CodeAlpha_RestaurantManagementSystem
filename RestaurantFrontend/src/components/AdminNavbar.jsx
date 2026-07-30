import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const token = localStorage.getItem("token");

  let username = "Admin";

  if (token) {
    try {
      const decoded = jwtDecode(token);

      username =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] || "Admin";
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header className="bg-white shadow px-8 py-5 flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold">
          Hello, {username} 👋
        </h2>

        <p className="text-gray-500">
          Welcome back!
        </p>
      </div>

    </header>
  );
}
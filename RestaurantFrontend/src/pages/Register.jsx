import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Registration successful. Please login.");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Register to order food online
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/"
            className="text-orange-600 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}
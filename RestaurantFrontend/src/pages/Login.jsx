import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveToken, getRole } from "../utils/auth";
import toast from "react-hot-toast";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await api.post("/Auth/login", {
                email,
                password,
            });

            saveToken(response.data.token);

            toast.success("Login successful!");

            const role = getRole();

if (role === "Admin") {
    navigate("/admin/dashboard");
} else if (role === "Customer") {
    navigate("/customer/home");
} else {
    setError("Invalid user role.");
}

        } catch (err) {
            setError(
                err.response?.data ||
                "Invalid email or password."
            );
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-200 flex items-center justify-center px-6">

            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">

                <div className="text-center mb-8">

                    <h1 className="text-4xl font-bold text-orange-600">
                        🍽 Restaurant
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Management System
                    </p>

                </div>

                <h2 className="text-2xl font-bold text-center mb-6">
                    Welcome Back
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-4">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700 transition text-white font-semibold py-3 rounded-xl"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-orange-600 font-semibold ml-2 hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;
import React, { useState, useContext } from "react";
import AuthContext from "../auth/AuthContext";
import api from "../api/api";
import { useNavigate, Navigate } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";

const LoginPage: React.FC = () => {
  const { user, login } = useContext(AuthContext);
  // const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  // Redirect to /jobs if already logged in
  if (user) {
    return <Navigate to="/jobs" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      const userData = {
        id: res.data.id,
        name: res.data.name,
        role: res.data.role,
        token: res.data.token,
      };
      login(userData);
      api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      navigate("/jobs");
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          Sign In
        </h1>
        {error && (
          <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input input-bordered w-full mb-4 px-4 py-3 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input input-bordered w-full mb-6 px-4 py-3 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded font-semibold hover:bg-blue-800 transition"
        >
          Login
        </button>
        {/* <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-700 hover:underline font-semibold">
            Register here
          </a>
        </p> */}
      </form>
    </div>
  );
};

export default LoginPage;

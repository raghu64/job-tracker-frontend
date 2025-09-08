import React, { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="input input-bordered w-full"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="input input-bordered w-full"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength={5}
          className="input input-bordered w-full"
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          minLength={5}
          className="input input-bordered w-full"
        />
        <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-700 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

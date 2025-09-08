import React from "react";
import { Outlet, Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between bg-gray-100 p-4 shadow">
        <Link to="/" className="text-xl font-bold text-blue-700">
          Job Tracker
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/jobs" className="hover:underline">
            Jobs
          </Link>
          <Link to="/calls" className="hover:underline">
            Calls
          </Link>
          <Link to="/employers" className="hover:underline">
            Employers
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Job Tracker
      </footer>
    </div>
  );
}

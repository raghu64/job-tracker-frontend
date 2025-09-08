import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <Link to="/" className="text-xl font-bold text-blue-700">
        Job Tracker
      </Link>
      <nav className="flex items-center space-x-4">
        {/* Add other nav links here */}
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
  );
}

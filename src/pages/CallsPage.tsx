import React, { useState } from "react";
import { useFormSidebar } from "../contexts/FormSidebarContext";

import api from "../api/api";

import CallList from "../components/CallList";

import CallForm from "../components/CallForm";

import { Call, Job } from "../types/models";

import { useJobs } from "../contexts/JobsContext";

import { useCalls } from "../contexts/CallsContext";

import { useEmployers } from "../contexts/EmployersContext";

import { useLoading } from "../contexts/LoadingContext";

export default function CallsPage() {

  const { setEditingCall, openCallForm } = useFormSidebar();
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Call>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { jobs } = useJobs();
  const { employers } = useEmployers();
  const { refreshCalls, removeCall, calls } = useCalls();
  const { setLoading } = useLoading();

  // useEffect(() => {
  //   // No initial API calls here as calls, jobs, employers managed by context
  // }, []);

  const jobMap = jobs.reduce((acc, job) => {
    acc[job._id!] = job;
    return acc;
  }, {} as Record<string, Job>);

  // Sorting and filtering calls based on search and sort criteria
  const sortedCalls = [...calls]
    .filter((call) =>
      [call.name, call.vendor, call.phoneNumber, call.notes, call.date]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a: Call, b: Call) => {
      const x = String(a[sortField] ?? "");
      const y = String(b[sortField] ?? "");
      if (x === y) return 0;
      if (sortOrder === "asc") return x > y ? 1 : -1;
      return x < y ? 1 : -1;
    });

  const handleAddClick = () => {
    setEditingCall(undefined);
    openCallForm();
  };

  // Form success/cancel handled in Layout via context
  const handleEdit = (call: Call) => {
    setEditingCall(call);
    openCallForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this call?")) {
      setLoading(true);
      await api.delete(`/calls/${id}`);
      removeCall(id);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 bg-white rounded shadow h-full">
      <h1 className="text-2xl font-bold mb-4">Calls</h1>

      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <input
          type="search"
          placeholder="Search calls..."
          className="input w-full pl-4 sm:w-auto sm:flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-9 sm:h-15"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleAddClick}
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 btn btn-primary w-full sm:w-auto transition"
        >
          + Add Call
        </button>
      </div>

      <div className="overflow-x-auto">
        <CallList
          calls={sortedCalls}
          employers={employers}
          jobMap={jobMap}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(field: keyof Call) => {
            if (sortField === field)
              setSortOrder((order: "asc" | "desc") => (order === "asc" ? "desc" : "asc"));
            else {
              setSortField(field);
              setSortOrder("asc");
            }
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Sidebar form rendering handled in Layout */}
    </div>
  );
}

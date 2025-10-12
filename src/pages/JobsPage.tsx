import React, { useEffect, useState } from "react";
import { useFormSidebar } from "../contexts/FormSidebarContext";
import api from "../api/api";
import JobList from "../components/JobList";
import JobForm from "../components/JobForm";
import { Job } from "../types/models";
import { useJobs } from "../contexts/JobsContext";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";

export default function JobsPage() {
  // const [jobs, setJobs] = useState([]);

  // const [employers, setEmployers] = useState([]);

  const { setEditingJob, openJobForm } = useFormSidebar();
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Job>("dateSubmitted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { employers } = useEmployers();
  const { jobs, removeJob, refreshJobs } = useJobs();
  const { setLoading } = useLoading();

  useEffect(() => {
    // initial loading can be handled by context
  }, []);

  const sortedJobs = [...jobs]
    .filter((job) =>
      [job.title, job.jobLocation, job.jobDescription, job.status, job.client, job.vendor]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a: Job, b: Job) => {
      const x = String(a[sortField] ?? "");
      const y = String(b[sortField] ?? "");
      if (x === y) return 0;
      if (sortOrder === "asc") return x > y ? 1 : -1;
      return x < y ? 1 : -1;
    });

  const handleAddClick = () => {
    setEditingJob(undefined);
    openJobForm();
  };

  // Form success/cancel handled in Layout via context
  const handleEdit = (job: Job) => {
    setEditingJob(job);
    openJobForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setLoading(true);
      await api.delete(`/jobs/${id}`);
      removeJob(id);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 bg-white rounded shadow h-full">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="search"
          placeholder="Search jobs..."
          className="input w-full pl-4 sm:w-auto sm:flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-9 sm:h-15"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          onClick={handleAddClick} 
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition btn btn-primary w-full sm:w-auto">
          + Add Job
        </button>
      </div>

      <JobList
        jobs={sortedJobs}
        employers={employers}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(field: keyof Job) => {
          if (sortField === field)
            setSortOrder((order: "asc" | "desc") => (order === "asc" ? "desc" : "asc"));
          else {
            setSortField(field);
            setSortOrder("asc");
          }
        }}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Sidebar form rendering handled in Layout */}
    </div>
  );
}

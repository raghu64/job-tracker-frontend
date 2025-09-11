import React, { useEffect, useState } from "react";
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

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
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
    .sort((a, b) => {
      const x = String(a[sortField] ?? "");
      const y = String(b[sortField] ?? "");
      if (x === y) return 0;
      if (sortOrder === "asc") return x > y ? 1 : -1;
      return x < y ? 1 : -1;
    });

  const handleAddClick = () => setModalOpen(true);

  const handleFormSuccess = () => {
    setModalOpen(false);
    refreshJobs();
  };

  const handleFormCancel = () => {
    setModalOpen(false);
    setEditingJob(null);
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setModalOpen(true);
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
    <>
      <div className="max-w-screen-lg mx-auto p-4 sm:p-6 bg-white rounded shadow">
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
              setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
            else {
              setSortField(field);
              setSortOrder("asc");
            }
          }}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[80vh] overflow-auto relative">
            <JobForm
              jobToEdit={editingJob || undefined}
              employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </>
  );
}

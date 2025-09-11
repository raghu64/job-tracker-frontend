import React, { useEffect, useState } from "react";
import api from "../api/api";
import JobList from "../components/JobList";
import JobForm from "../components/JobForm";
import { Job } from "../types/models";
import { useJobs } from "../contexts/JobsContext";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";

export default function JobsPage() {
  // const [jobs, setJobs] = useState<Job[]>([]);
  // const [employers, setEmployers] = useState<Employer[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<keyof Job>("dateSubmitted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { employers } = useEmployers();

  const { jobs, removeJob, refreshJobs } = useJobs();
  const { setLoading } = useLoading();

  useEffect(() => {
    // setLoading(true);
    // // api.get("/jobs/mine").then(r => setJobs(r.data));
    // api.get("/employers").then(r => {
    //   setEmployers(r.data);
    //   setLoading(false);
    // });
  }, []);

  // const filteredJobs = jobs.filter(job =>
  //   [job.title, job.jobLocation, job.status, job.client, job.vendor]
  //     .join(" ")
  //     .toLowerCase()
  //     .includes(search.toLowerCase())
  // );

  const sortedJobs = [...jobs]
    .filter(job =>
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

  // const refreshJobs = () => api.get("/jobs/mine").then(r => setJobs(r.data));

  const handleAddClick = () => setModalOpen(true);

  const handleFormSuccess = () => {
    setModalOpen(false);
    refreshJobs();
  };

  const handleFormCancel = () => setModalOpen(false);

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
    <div className="flex w-full flex-col gap-8 px-4 py-8 items-start">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-bold">Jobs</h2>
        <input
            type="text"
            className="input input-bordered px-3 py-2 rounded border border-blue-500"
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
          onClick={handleAddClick}
        >
          + Add Job
        </button>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <JobList
          jobs={sortedJobs}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (sortField === field) setSortOrder(order => (order === "asc" ? "desc" : "asc"));
            else {
              setSortField(field);
              setSortOrder("asc");
            }
          }}
          employers={employers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md p-8 rounded shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Add Job</h3>

            <JobForm
              key={editingJob?._id || "new"}
              employerOptions={employers.map(e => ({ value: e._id!, label: e.name }))}
              jobToEdit={editingJob || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={handleFormCancel}
              aria-label="Close"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

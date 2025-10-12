import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import JobForm from "../components/JobForm";
import { Job } from "../types/models";
import { useJobs } from "../contexts/JobsContext";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";
import MarkdownDisplay from "../components/MarkdownDisplay";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const navigate = useNavigate();
  const { employers } = useEmployers();
  const { jobs, removeJob } = useJobs();
  const { setLoading } = useLoading();
  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      let job = jobs.filter((j) => j._id === id)[0];
      setJob(job);
      setLoading(false);
    }
  }, [id, jobs, setLoading]);

  const getEmployerName = (id?: string) => employers.find((e) => e._id === id)?.name || "";

  const handleEditSuccess = (job: Job) => {
    setJob(job);
    closeEditModal();
  };

  /**
   * The function `handleDelete` is an asynchronous function that confirms deletion of a job, sends a
   * delete request to the API, and handles success or failure accordingly.
   * @returns The `handleDelete` function is returning a Promise because it is an async function. The
   * function will return a Promise that resolves to undefined.
   */
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setDeleting(true);
    setLoading(true);
    try {
      await api.delete(`/jobs/${id}`);
      removeJob(id);
      navigate("/jobs");
    } catch {
      alert("Failed to delete job.");
      setDeleting(false);
    } finally {
      setLoading(false);
    }
  };

  console.log(job?.dateSubmitted)
  // if (loading) return <div className="p-4">Loading job details...</div>;
  // if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!job) return <div className="p-4">Job not found.</div>;

  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-6 bg-white rounded shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={openEditModal}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-base sm:text-lg">
        <div>
          <span className="font-semibold">Status:</span> {job.status || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Date (YYYY-MM-DD):</span>{" "}
          {job.dateSubmitted ? new Date(job.dateSubmitted).toISOString().split('T')[0] : "N/A"}
        </div>
        <div>
          <span className="font-semibold">Location:</span> {job.jobLocation || "N/A"}
        </div>
        <div>
          <span className="font-semibold">My Location:</span> {job.myLocation || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Client:</span> {job.client || "N/A"}
        </div>
        <div>
          <span className="font-semibold">End Client:</span> {job.endClient || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Vendor:</span> {job.vendor || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Rate:</span> {job.hourlyRate || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Marketing Team:</span> {job.marketingTeam || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Employer:</span> {getEmployerName(job.employerId) || "N/A"}
        </div>
      </div>

      {job.jobDescription && (
        <section className="mb-6 prose max-w-full">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <MarkdownDisplay content={job.jobDescription} />
          </div>
        </section>
      )}

      {job.notes && (
        <section className="mb-6 prose max-w-full">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <MarkdownDisplay content={job.notes} />
          </div>
        </section>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-auto relative">
            <JobForm
              key={job?._id || "new"}
              employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
              jobToEdit={job}
              onSuccess={handleEditSuccess}
              onCancel={closeEditModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

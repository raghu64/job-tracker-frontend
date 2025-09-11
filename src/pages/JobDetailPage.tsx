import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import JobForm from "../components/JobForm";
import { Job } from "../types/models";
import { useJobs } from "../contexts/JobsContext";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const [employers, setEmployers] = useState<Employer[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  // const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { employers } = useEmployers();

  const {jobs, removeJob } = useJobs();

  const { setLoading } = useLoading();

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);
//   const refreshJob = () => api.get(`/jobs/${id}`).then(r => setJob(r.data));

  useEffect(() => {
    if (id) {
      setLoading(true);
      // api.get("/employers").then(r => setEmployers(r.data));
      let job = jobs.filter(j => j._id === id)[0]
      setJob(job)
      setLoading(false)
    //   api.get<Job>(`/jobs/${id}`)
    //     .then(res => {
    //       setJob(res.data);
    //       setError(null);
    //     })
    //     .catch(() => {
    //       setError("Failed to load job details.");
    //       setJob(null);
    //     })
    //     .finally(() => setLoading(false));
    }
  }, [id, jobs, setLoading]);


  const getEmployerName = (id?: string) =>
    employers.find(e => e._id === id)?.name || "";

//   const handleEditSuccess = (updatedJob: Job) => {
    
//   };

  const handleEditSuccess = (job: Job) => {
    // setModalOpen(false);
    // setJob(updatedJob);
    
    // refreshJobs();
    // let job = jobs.filter(j => j._id === id)[0]
    setJob(job)
    closeEditModal();
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setDeleting(true);
    setLoading(true);
    try {
      await api.delete(`/jobs/${id}`);
      removeJob(id);
      navigate("/jobs"); // redirect to jobs list after delete
    } catch {
      alert("Failed to delete job.");
      setDeleting(false);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <div className="p-4">Loading job details...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!job) return <div className="p-4">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <div className="space-x-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <span className="font-semibold">Status:</span> {job.status || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{" "}
          {job.dateSubmitted ? new Date(job.dateSubmitted).toLocaleDateString() : "N/A"}
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
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-wrap">{job.jobDescription}</p>
        </div>
      )}
      <br/>
      {job.notes && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p className="whitespace-pre-wrap">{job.notes}</p>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeEditModal}
              aria-label="Close edit form"
            >
              ✕
            </button>
            <JobForm
              key={job?._id || "new"}
              employerOptions={employers.map(e => ({ value: e._id!, label: e.name }))}
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

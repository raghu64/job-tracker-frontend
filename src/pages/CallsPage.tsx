import React, { useEffect, useState } from "react";
import api from "../api/api";
import CallList from "../components/CallList";
import CallForm from "../components/CallForm";
import { Call, Job } from "../types/models";
import { useJobs } from "../contexts/JobsContext";
import { useCalls } from "../contexts/CallsContext";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";

export default function CallsPage() {
  // const [calls, setCalls] = useState<Call[]>([]);
  // const [jobs, setJobs] = useState<Job[]>([]);
  // const [employers, setEmployers] = useState<Employer[]>([]);
  const [editingCall, setEditingCall] = useState<Call | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Call>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { jobs } = useJobs();
  const { employers } = useEmployers();
  const { refreshCalls, removeCall, calls } = useCalls();

  const { setLoading } = useLoading();

  useEffect(() => {
    // api.get("/calls").then(r => setCalls(r.data));
    // api.get("/employers").then(r => setEmployers(r.data));
    // api.get("/jobs/mine").then(r => setJobs(r.data));
  }, []);


  const jobMap = jobs.reduce((acc, job) => {
    acc[job._id!] = job;
    return acc;
  }, {} as Record<string, Job>);

  // const filteredCalls = calls.filter(call =>
  //   [call.name, call.vendor, call.phoneNumber, call.notes, call.date]
  //     .join(" ")
  //     .toLowerCase()
  //     .includes(search.toLowerCase())
  // );

  const sortedJobs = [...calls]
    .filter(call =>
      [call.name, call.vendor, call.phoneNumber, call.notes, call.date]
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

  // const refreshCalls = () => api.get("/calls").then(r => setCalls(r.data));

  const handleAddClick = () => setModalOpen(true);

  const handleFormSuccess = () => {
    setModalOpen(false);
    refreshCalls();
  };

  const handleFormCancel = () => setModalOpen(false);

  const handleEdit = (call: Call) => {
    setEditingCall(call);
    setModalOpen(true);
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
    <div className="flex w-full flex-col gap-8 px-4 py-8 items-start">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-bold">Calls</h2>
        <input
            type="text"
            className="input input-bordered px-3 py-2 rounded border border-blue-500"
            placeholder="Search calls..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
          onClick={handleAddClick}
        >
          + Add Call
        </button>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <CallList
          calls={sortedJobs}
          jobMap={jobMap}
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md p-8 rounded shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Add Call</h3>
            <CallForm
              jobs={jobs || []}
              employerOptions={employers.map(e => ({ value: e._id!, label: e.name }))}
              callToEdit={editingCall || undefined}
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

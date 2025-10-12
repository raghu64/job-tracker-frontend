import React, { useState, useEffect } from "react";
import { Call, Job } from "../types/models";
import api from "../api/api";
import { useCalls } from "../contexts/CallsContext";
import { useLoading } from "../contexts/LoadingContext";

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
  employerOptions: { value: string; label: string }[];
  callToEdit?: Call
  jobs?: Job[]
};

const initialCall: Call = { jobId: "", name: "", vendor: "", phoneNumber: "", date: new Date().toISOString().split('T')[0], employerId: "" };


export default function CallForm({ callToEdit, jobs, onSuccess, onCancel, employerOptions }: Props) {
  const [call, setCall] = useState<Call>(initialCall);
  const [error, setError] = useState<string>("");

  const { addCall, updateCall } = useCalls();

  const { setLoading } = useLoading();

  const setField = (k: string, v: any) => setCall({ ...call, [k]: v });


  useEffect(() => {
    if (callToEdit) setCall(callToEdit);
    else setCall(initialCall);
  }, [callToEdit]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (call._id) {
        await api.put(`/calls/${call._id}`, call);
        updateCall(call);
      } else {
        await api.post("/calls", call);
        addCall(call);
      }
      setCall(initialCall);
      onSuccess();
    } catch (err: any) {
      // Handle Axios or fetch error, fallback to generic message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  
  return (
    <form onSubmit={onSubmit} className="bg-white rounded p-4 shadow grid gap-4 mb-8">
      <input className="input input-bordered w-full" name="name" value={call.name || ""} onChange={e => setField("name", e.target.value)} placeholder="Name" />
      <input className="input input-bordered w-full" name="vendor" value={call.vendor || ""} onChange={e => setField("vendor", e.target.value)} placeholder="Vendor" />
      <input className="input input-bordered w-full" name="phoneNumber" value={call.phoneNumber || ""} onChange={e => setField("phoneNumber", e.target.value)} placeholder="Phone" />
      <input type="date" className="input input-bordered w-full" name="date" value={call.date ? call.date.split("T")[0] : ""} onChange={e => setField("date", e.target.value)} placeholder="Date" />
      <select className="input input-bordered w-full" name="employerId" value={call.employerId || ""} onChange={e => setField("employerId", e.target.value)}>
        <option value="">-- Employer --</option>
        {employerOptions.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
      </select>
      <textarea className="input input-bordered w-full" name="notes" value={call.notes || ""} onChange={e => setField("notes", e.target.value)} placeholder="Notes" />
      <input className="input input-bordered w-full" name="marketingTeam" value={call.marketingTeam || ""} onChange={e => setField("marketingTeam", e.target.value)} placeholder="Marketing Team" />
      <select
        value={call.jobId || ""}
        onChange={e => setCall({ ...call, jobId: e.target.value })}
        className="input input-bordered w-full"
      >
        <option value="">Select a job</option>
        {jobs?.map(j => (
          <option key={j._id} value={j._id}>{j.title} - {j.jobLocation}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">
          {callToEdit ? "Update" : "Add"} Call
        </button>
        {onCancel &&
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100">
            Cancel
          </button>}
      </div>
    </form>
  );
}

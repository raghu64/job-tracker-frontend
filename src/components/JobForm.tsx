import React, { useState } from "react";
import { Job } from "../types/models";
import api from "../api/api";
import { useJobs } from "../contexts/JobsContext";
import { useLoading } from "../contexts/LoadingContext";


console.log("new Date: ", new Date().toString())
type Props = {
  onSuccess: (job: Job) => void;
  onCancel?: () => void;
  employerOptions: { value: string; label: string }[];
  jobToEdit?: Job;
};
const statusOptions = [
  "Submitted to Vendor","Vendor called","Submitted to Client","Phone Screening",
  "Video Screening","Code Assessment","Interview L1","Interview L2","Interview L3",
  "Final Round","In-Person","Rejected","Selected"
];

const initialJob: Job = {
  title: "", jobLocation: "", status: "Submitted to Vendor",
  vendor: "", client: "", endClient: "", employerId: "", dateSubmitted: new Date().toISOString().split('T')[0], notes: ""
};

export default function JobForm({ onSuccess, employerOptions, jobToEdit, onCancel }: Props) {
  const [job, setJob] = useState<Job>(jobToEdit || initialJob);
  const { addJob, updateJob } = useJobs();
  
  const { setLoading } = useLoading();

  const setField = (field: string, value: any) => setJob({ ...job, [field]: value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if(jobToEdit && jobToEdit._id){
      await api.put(`/jobs/${jobToEdit._id}`, job);
      updateJob({...job, _id: jobToEdit._id});
    } else {
      const res = await api.post("/jobs", job);
      addJob(res.data);
    }
      // ? await api.put(`/jobs/${jobToEdit._id}`, job)
      // : await api.post("/jobs", job);
    onSuccess(job);
    setJob(initialJob);
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow grid gap-4">
      <input className="input input-bordered w-full" name="title" value={job.title}
        onChange={e => setField("title", e.target.value)} placeholder="Title" required />
      <input className="input input-bordered w-full" name="jobLocation" value={job.jobLocation}
        onChange={e => setField("jobLocation", e.target.value)} placeholder="Job Location" />
      <input className="input input-bordered w-full" name="myLocation" value={job.myLocation}
        onChange={e => setField("myLocation", e.target.value)} placeholder="My Location" />
      <select className="input input-bordered w-full" name="status" value={job.status}
        onChange={e => setField("status", e.target.value)}>
        {statusOptions.map(s => <option key={s}>{s}</option>)}
      </select>
      <input className="input input-bordered w-full" name="vendor" value={job.vendor}
        onChange={e => setField("vendor", e.target.value)} placeholder="Vendor" />
      <input className="input input-bordered w-full" name="client" value={job.client}
        onChange={e => setField("client", e.target.value)} placeholder="Client" />
      <input className="input input-bordered w-full" name="endClient" value={job.endClient}
        onChange={e => setField("endClient", e.target.value)} placeholder="End Client" />
      <input type="date" className="input input-bordered w-full" name="dateSubmitted" value={job.dateSubmitted ? job.dateSubmitted.split("T")[0] : ""}
        onChange={e => setField("dateSubmitted", e.target.value)} placeholder="Due Date" />
      <select className="input input-bordered w-full" name="employerId" value={job.employerId} required
        onChange={e => setField("employerId", e.target.value)}>
        <option value="">-- Employer --</option>
        {employerOptions.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
      </select>
      <textarea className="input input-bordered w-full" rows={2} name="jobDescription"
        value={job.jobDescription || ""} onChange={e => setField("jobDescription", e.target.value)}
        placeholder="Job Description" />
      <textarea className="input input-bordered w-full" rows={2} name="notes"
        value={job.notes || ""} onChange={e => setField("notes", e.target.value)}
        placeholder="Notes" />
      <input className="input input-bordered w-full" name="marketingTeam" value={job.marketingTeam}
        onChange={e => setField("marketingTeam", e.target.value)} placeholder="Marketing Team" />
      <input className="input input-bordered w-full" name="hourlyRate" value={job.hourlyRate}
        onChange={e => setField("hourlyRate", e.target.value)} placeholder="Hourly Rate" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">
          {jobToEdit ? "Update" : "Add"} Job
        </button>
        {jobToEdit && onCancel &&
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100">
            Cancel
          </button>}
      </div>
    </form>
  );
}

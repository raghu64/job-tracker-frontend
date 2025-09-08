import React from "react";
import { Job, Employer } from "../types/models";
import { MdEdit, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = {
  jobs: Job[];
  employers: Employer[];
  sortField: keyof Job;
  sortOrder: "asc" | "desc";
  onSort: (field: keyof Job) => void;
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
};

const sortIcon = (active: boolean, order: "asc" | "desc") =>
  active ? (order === "asc" ? "▲" : "▼") : "";

export default function JobList({ jobs, sortField, sortOrder, onSort, employers, onDelete, onEdit }: Props) {
  const getEmployerName = (id?: string) =>
    employers.find(e => e._id === id)?.name || "";

  return (
    <div className="flex-1 overflow-auto shadow rounded bg-white">
      <table className="min-w-full table-fixed text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-1 text-left actions-col"></th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("title")}>Title {sortIcon(sortField === "title", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("jobLocation")}>Job Location {sortIcon(sortField === "jobLocation", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("dateSubmitted")}>Date {sortIcon(sortField === "dateSubmitted", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("status")}>Status {sortIcon(sortField === "status", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("vendor")}>Vendor {sortIcon(sortField === "vendor", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("client")}>Client {sortIcon(sortField === "client", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("endClient")}>End Client {sortIcon(sortField === "endClient", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("hourlyRate")}>Hourly Rate {sortIcon(sortField === "hourlyRate", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("marketingTeam")}>Marketing Team {sortIcon(sortField === "marketingTeam", sortOrder)}</th>
            <th className="p-2 w-1/10 text-left" onClick={() => onSort("notes")}>Notes {sortIcon(sortField === "notes", sortOrder)}</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id} className="border-t hover:bg-blue-50">
              <td className="p-1 actions-col">
                <button 
                  aria-label="Edit Job"
                  className="text-blue-600 hover:text-blue-800 p-0.5"
                  style={{ lineHeight: 0 }}
                  onClick={() => onEdit(job)}
                >
                    <MdEdit size={16} />
                </button>
                <button 
                  aria-label="Delete Job"
                  className="text-red-600 hover:text-red-800 p-0.5"
                  style={{ lineHeight: 0 }}
                  onClick={() => job._id && onDelete(job._id)}
                >
                  <MdDelete size={16} />
                </button>
              </td>
              <td className="p-2 w-1/10">
                <Link to={`/jobs/${job._id}`} className="text-blue-700 hover:underline">
                  {job.title}
                </Link>
              </td>
              <td className="p-2 w-1/10">{job.jobLocation}</td>
              <td className="p-2 w-1/10">{job.dateSubmitted}</td>
              <td className="p-2 w-1/10">{job.status}</td>
              <td className="p-2 w-1/10">{job.vendor}</td>
              <td className="p-2 w-1/10">{job.client}</td>
              <td className="p-2 w-1/10">{job.endClient}</td>
              {/* <td className="p-2 w-1/8">{getEmployerName(job.employerId)}</td> */}
              <td className="p-2 w-1/10">{job.hourlyRate}</td>
              <td className="p-2 w-1/10">{job.marketingTeam}</td>
              <td className="p-2 w-1/10">{job.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

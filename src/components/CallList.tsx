import React from "react";
import { Call, Employer, Job } from "../types/models";
import { MdEdit, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = { 
  calls: Call[]; 
  jobMap: Record<string, Job>;
  employers: Employer[];
  sortField: keyof Call;
  sortOrder: "asc" | "desc";
  onSort: (field: keyof Call) => void;
  onEdit: (call: Call) => void;
  onDelete: (id: string) => void;
};

const sortIcon = (active: boolean, order: "asc" | "desc") =>
  active ? (order === "asc" ? "▲" : "▼") : "";


export default function CallList({ calls, jobMap, employers, sortField, sortOrder, onSort, onDelete, onEdit }: Props) {
  const getEmployerName = (id?: string) =>
    employers.find(e => e._id === id)?.name || "";

  return (
    <div className="flex-1 overflow-auto shadow rounded bg-white">
      <table className="min-w-full table-fixed text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-1 text-left actions-col"></th>
            <th className="p-1 text-left actions-col">Job</th>
            <th className="p-2 w-1/6 text-left" onClick={() => onSort("name")}>Name {sortIcon(sortField === "name", sortOrder)}</th>
            <th className="p-2 w-1/6 text-left" onClick={() => onSort("vendor")}>Vendor {sortIcon(sortField === "vendor", sortOrder)}</th>
            <th className="p-2 w-1/6 text-left" onClick={() => onSort("phoneNumber")}>Phone {sortIcon(sortField === "phoneNumber", sortOrder)}</th>
            <th className="p-2 w-1/6 text-left" onClick={() => onSort("date")}>Date {sortIcon(sortField === "date", sortOrder)}</th>
            <th className="p-2 w-1/6 text-left" onClick={() => onSort("employerId")}>Employer {sortIcon(sortField === "employerId", sortOrder)}</th>
            {/* <th className="p-2 w-1/7 text-left" onClick={() => onSort("notes")}>Notes {sortIcon(sortField === "notes", sortOrder)}</th> */}
            <th className="p-2 w-1/6 text-left" onClick={() => onSort("marketingTeam")}>Marketing Team {sortIcon(sortField === "marketingTeam", sortOrder)}</th>
          </tr>
        </thead>
        <tbody>
          {calls.map(call => (
            <tr key={call._id} className="border-t hover:bg-blue-50">
              <td className="p-1 actions-col">
                <button 
                  aria-label="Edit Call"
                  className="text-blue-600 hover:text-blue-800 p-0.5"
                  style={{ lineHeight: 0 }}
                  onClick={() => onEdit(call)}
                >
                    <MdEdit size={16} />
                </button>
                <button 
                  aria-label="Delete Call"
                  className="text-red-600 hover:text-red-800 p-0.5"
                  style={{ lineHeight: 0 }}
                  onClick={() => call._id && onDelete(call._id)}
                >
                  <MdDelete size={16} />
                </button>
              </td>
              <td className="p-2">
                {call.jobId ? (
                  <Link to={`/jobs/${call.jobId}`} className="text-blue-700 hover:underline">
                    {jobMap[call.jobId]?.title ?? call.jobId}
                  </Link>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2 w-1/6">{call.name}</td>
              <td className="p-2 w-1/6">{call.vendor}</td>
              <td className="p-2 w-1/6">{call.phoneNumber}</td>
              <td className="p-2 w-1/6">{call.date}</td>
              <td className="p-2 w-1/6">{getEmployerName(call.employerId)}</td>
              {/* <td className="p-2 w-1/7">{call.notes}</td> */}
              <td className="p-2 w-1/6">{call.marketingTeam}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import { Employer } from "../types/models";
import { MdEdit, MdDelete } from "react-icons/md";

type Props = { 
  employers: Employer[];
  onEdit: (employer: Employer) => void;
  onDelete: (id: string) => void;
};

export default function EmployerList({ employers, onEdit, onDelete }: Props) {
  return (
    <div className="flex-1 overflow-x-auto shadow rounded bg-white">
      <table className="min-w-full table-fixed text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-1 text-left actions-col"></th>
            <th className="p-2 w-1/5 text-left">Name</th>
            <th className="p-2 w-1/5 text-left">Contact Email</th>
            <th className="p-2 w-1/5 text-left">Phone</th>
            <th className="p-2 w-1/5 text-left">Address</th>
          </tr>
        </thead>
        <tbody>
          {employers.map(emp => (
            <tr key={emp._id} className="border-t hover:bg-blue-50">
              <td className="p-1 actions-col">
                <button
                  aria-label="Edit Employer"
                  className="text-blue-600 hover:text-blue-800 p-0.5"
                  style={{ lineHeight: 0 }}
                  onClick={() => onEdit(emp)}
                >
                  <MdEdit size={16} />
                </button>
                <button
                  aria-label="Delete Employer"
                  className="text-red-600 hover:text-red-800 p-0.5"
                  style={{ lineHeight: 0 }}
                  onClick={() => emp._id && onDelete(emp._id)}
                >
                  <MdDelete size={16} />
                </button>
              </td>
              <td className="p-2 w-1/5">{emp.name}</td>
              <td className="p-2 w-1/5">{emp.contactEmail}</td>
              <td className="p-2 w-1/5">{emp.phone}</td>
              <td className="p-2 w-1/5">{emp.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

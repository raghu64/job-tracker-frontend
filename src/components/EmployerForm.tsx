import React, { useState } from "react";
import { Employer } from "../types/models";
import api from "../api/api";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
  employerToEdit?: Employer;

};

export default function EmployerForm({ onSuccess, onCancel, employerToEdit }: Props) {
  const { addEmployer, updateEmployer } = useEmployers();
  const [emp, setEmp] = useState<Employer>({ name: "" });
  const [error, setError] = useState<string>("");
  const setField = (k: string, v: any) => setEmp({ ...emp, [k]: v });
  const emptyEmployer: Employer = { name: "" };
  
  const { setLoading } = useLoading();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (emp._id) {
        const res = await api.put<Employer>(`/employers/${emp._id}`, emp);
        updateEmployer(res.data);
      } else {
        const res = await api.post<Employer>("/employers", emp);
        addEmployer(res.data);
      }
      setEmp(emptyEmployer);
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else if (err.message) setError(err.message);
      else setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <form onSubmit={onSubmit} className="bg-white rounded p-4 shadow grid gap-4 mb-8">
      {error && <div className="text-red-600">{error}</div>}
      <input className="input input-bordered w-full" name="name" value={emp.name} onChange={e => setField("name", e.target.value)} placeholder="Name" required />
      <input className="input input-bordered w-full" name="contactEmail" value={emp.contactEmail || ""} onChange={e => setField("contactEmail", e.target.value)} placeholder="Contact Email" />
      <input className="input input-bordered w-full" name="phone" value={emp.phone || ""} onChange={e => setField("phone", e.target.value)} placeholder="Phone" />
      <input className="input input-bordered w-full" name="address" value={emp.address || ""} onChange={e => setField("address", e.target.value)} placeholder="Address" />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {emp._id ? "Update Employer" : "Add Employer"}
        </button>
        {emp._id && onCancel && (
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
            onClick={() => {
              setEmp(emptyEmployer);
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {/* <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">Add Employer</button> */}
    </form>
  );
}

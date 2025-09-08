import React, { useState } from "react";
import { Employer } from "../types/models";
import api from "../api/api";

type Props = { 
  onSuccess: () => void;
  onCancel?: () => void;
  employerToEdit?: Employer;
  
 };

export default function EmployerForm({ onSuccess }: Props) {
  const [emp, setEmp] = useState<Employer>({ name: "" });
  const setField = (k: string, v: any) => setEmp({ ...emp, [k]: v });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/employers", emp);
    setEmp({ name: "" });
    onSuccess();
  };

  return (
    <form onSubmit={onSubmit} className="bg-white rounded p-4 shadow grid gap-4 mb-8">
      <input className="input input-bordered w-full" name="name" value={emp.name} onChange={e => setField("name", e.target.value)} placeholder="Name" required />
      <input className="input input-bordered w-full" name="contactEmail" value={emp.contactEmail || ""} onChange={e => setField("contactEmail", e.target.value)} placeholder="Contact Email" />
      <input className="input input-bordered w-full" name="phone" value={emp.phone || ""} onChange={e => setField("phone", e.target.value)} placeholder="Phone" />
      <input className="input input-bordered w-full" name="address" value={emp.address || ""} onChange={e => setField("address", e.target.value)} placeholder="Address" />
      <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">Add Employer</button>
    </form>
  );
}

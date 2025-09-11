import React, { useState } from "react";
import api from "../api/api";
import EmployerList from "../components/EmployerList";
import EmployerForm from "../components/EmployerForm";
import { Employer } from "../types/models";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";

export default function EmployersPage() {

  const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { setLoading } = useLoading();
  const { employers, removeEmployer } = useEmployers();

  const handleAddClick = () => setModalOpen(true);

  const handleFormSuccess = () => {
    setModalOpen(false);
    setEditingEmployer(null);
  };

  const handleFormCancel = () => {
    setModalOpen(false);
    setEditingEmployer(null);
  }

  const handleEdit = (employer: Employer) => {
    setEditingEmployer(employer);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employer?")) {
      setLoading(true);
      await api.delete(`/employers/${id}`);
      removeEmployer(id);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto p-4 sm:p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Employers</h1>

        <button
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition btn btn-primary w-full sm:w-auto mb-4"
          onClick={handleAddClick}
        >
          + Add Employer
        </button>

        <EmployerList 
          employers={employers} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 max-h-[80vh] overflow-auto relative">
            <EmployerForm 
              onSuccess={handleFormSuccess} 
              onCancel={handleFormCancel} 
              employerToEdit={editingEmployer || undefined}
            />
            
          </div>
        </div>
      )}
    </>
  );
}

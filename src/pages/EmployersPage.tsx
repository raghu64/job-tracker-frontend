import React, { useState } from "react";
import api from "../api/api";
import EmployerList from "../components/EmployerList";
import EmployerForm from "../components/EmployerForm";
import { Employer } from "../types/models";
import { useEmployers } from "../contexts/EmployersContext";
import { useLoading } from "../contexts/LoadingContext";

export default function EmployersPage() {
  // const [employers, setEmployers] = useState<Employer[]>([]);
  // const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { setLoading } = useLoading();
  const { employers, removeEmployer } = useEmployers();

  // useEffect(() => {
  //   setLoading(true);
  //   api.get("/employers").then(r => {
  //     setEmployers(r.data);
  //     setLoading(false);
  //   });
  // }, []);

  // const refreshEmployers = () => {
  //   setLoading(true);
  //   api.get("/employers").then(r => {
  //     setEmployers(r.data);
  //     setLoading(false);
  //   });
  // }

  const handleAddClick = () => setModalOpen(true);

  const handleFormSuccess = () => {
    setModalOpen(false);
    // refreshEmployers();
  };

  const handleFormCancel = () => setModalOpen(false);

  const handleEdit = (employer: Employer) => {
    // todo: implement edit functionality
    // setEditingEmployer(employer);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employer?")) {
      setLoading(true);
      await api.delete(`/employers/${id}`);
      removeEmployer(id);
      // refreshEmployers();
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 px-4 py-8 items-start">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-bold">Employers</h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
          onClick={handleAddClick}
        >
          + Add Employer
        </button>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <EmployerList
          employers={employers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md p-8 rounded shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Add Employer</h3>
            <EmployerForm
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

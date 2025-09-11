import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/api";
import { Employer } from "../types/models";
import { useLoading } from "./LoadingContext";

type EmployersContextType = {
  employers: Employer[];
  addEmployer: (employer: Employer) => void;
  updateEmployer: (employer: Employer) => void;
  removeEmployer: (id: string) => void;
//   refreshEmployers: () => Promise<void>;
};

const EmployersContext = createContext<EmployersContextType | undefined>(undefined);

export function EmployersProvider({ children }: { children: ReactNode }) {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    let isMounted = true;

    const fetchEmployers = async () => {
      setLoading?.(true);
      try {
        const res = await api.get<Employer[]>("/employers");
        if (isMounted) setEmployers(res.data);
      } catch (error) {
        console.error("Failed to fetch employers:", error);
        if (isMounted) setEmployers([]);
      } finally {
        if (isMounted) setLoading?.(false);
      }
    };

    fetchEmployers();

    return () => {
      isMounted = false;
    };
  }, [setLoading]);
//   useEffect(() => {
//     refreshEmployers();
//   }, []);

//   const refreshEmployers = async () => {
//     setLoading(true);
//     const res = await api.get<Employer[]>("/employers");
//     setEmployers(res.data);
//     setLoading(false);
//   };

  const addEmployer = (employer: Employer) =>
    setEmployers(employers => [employer, ...employers]);

  const updateEmployer = (employer: Employer) =>
    setEmployers(employers => employers.map(e => (e._id === employer._id ? employer : e)));

  const removeEmployer = (id: string) =>
    setEmployers(employers => employers.filter(e => e._id !== id));

  return (
    <EmployersContext.Provider
      value={{ employers, addEmployer, updateEmployer, removeEmployer }}
    >
      {children}
    </EmployersContext.Provider>
  );
}

export function useEmployers() {
  const ctx = useContext(EmployersContext);
  if (!ctx) throw new Error("useEmployers must be used within EmployersProvider");
  return ctx;
}

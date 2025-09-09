import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import api from "../api/api";
import { Job } from "../types/models";
import { useAuth } from "../auth/useAuth"

type JobsContextType = {
  jobs: Job[];
  refreshJobs: () => Promise<void>;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  removeJob: (id: string) => void;
};

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  // Fetch all jobs from API only once
  const refreshJobs = async () => {
    const res = await api.get<Job[]>("/jobs/mine");
    setJobs(res.data);
  };

  // useEffect(() => {
  //   refreshJobs();
  // }, []);

  useEffect(() => {
      if (user) {
        refreshJobs();
      }
      // Optionally: clear calls on logout
      else {
        setJobs([]);
      }
    }, [user]);

  // Cache update helpers
  const addJob = (job: Job) => setJobs(jobs => [job, ...jobs]);
  const updateJob = (job: Job) => setJobs(jobs => jobs.map(j => j._id === job._id ? job : j));
  const removeJob = (id: string) => setJobs(jobs => jobs.filter(j => j._id !== id));

  return (
    <JobsContext.Provider value={{ jobs, refreshJobs, addJob, updateJob, removeJob }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within JobsProvider");
  return ctx;
};

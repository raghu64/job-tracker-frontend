import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import api from "../api/api";
import { Job } from "../types/models";
import { useAuth } from "../auth/useAuth"
import { useLoading } from "./LoadingContext";

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
  const { setLoading } = useLoading();

  // Fetch all jobs from API only once
  const refreshJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get<Job[]>("/jobs/mine");
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]); // Optional: clear jobs on error
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   refreshJobs();
  // }, []);

  // useEffect(() => {
  //   if (user) {
  //     refreshJobs();
  //   }
  //   // Optionally: clear calls on logout
  //   else {
  //     setJobs([]);
  //   }
  // }, [user, refreshJobs]);
  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      setLoading?.(true);
      try {
        const res = await api.get<Job[]>("/jobs/mine");
        if (isMounted) setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        if (isMounted) setJobs([]);
      } finally {
        if (isMounted) setLoading?.(false);
      }
    };

    if (user) {
      fetchJobs();
    } else {
      setJobs([]);
    }

    return () => {
      isMounted = false;
    };
  }, [user, setLoading]);

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

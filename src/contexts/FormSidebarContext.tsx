import React, { createContext, useContext, useState, ReactNode } from "react";
import { Job, Call } from "../types/models";

export type SidebarFormState = {
  jobFormOpen: boolean;
  callFormOpen: boolean;
  editingJob?: Job;
  editingCall?: Call;
};

const initialState: SidebarFormState = {
  jobFormOpen: false,
  callFormOpen: false,
  editingJob: undefined,
  editingCall: undefined,
};

const FormSidebarContext = createContext<{
  state: SidebarFormState;
  openJobForm: () => void;
  openCallForm: () => void;
  closeJobForm: () => void;
  closeCallForm: () => void;
  closeAll: () => void;
  setEditingJob: (job?: Job) => void;
  setEditingCall: (call?: Call) => void;
}>({
  state: initialState,
  openJobForm: () => {},
  openCallForm: () => {},
  closeJobForm: () => {},
  closeCallForm: () => {},
  closeAll: () => {},
  setEditingJob: () => {},
  setEditingCall: () => {},
});

export function useFormSidebar() {
  return useContext(FormSidebarContext);
}

export function FormSidebarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarFormState>(initialState);

  // Open forms while preserving the state of the other form
  const openJobForm = () => setState((s) => ({ ...s, jobFormOpen: true }));
  const openCallForm = () => setState((s) => ({ ...s, callFormOpen: true }));

  // Close forms while preserving the state of the other form
  const closeJobForm = () => setState((s) => ({
    ...s,
    jobFormOpen: false,
    editingJob: undefined,
    callFormOpen: s.callFormOpen,
    editingCall: s.editingCall
  }));

  const closeCallForm = () => setState((s) => ({
    ...s,
    callFormOpen: false,
    editingCall: undefined,
    jobFormOpen: s.jobFormOpen,
    editingJob: s.editingJob
  }));

  // Close both forms
  const closeAll = () => setState(initialState);

  const setEditingJob = (job?: Job) => setState((s) => ({ ...s, editingJob: job, jobFormOpen: true }));
  const setEditingCall = (call?: Call) => setState((s) => ({ ...s, editingCall: call, callFormOpen: true }));

  return (
    <FormSidebarContext.Provider
      value={{
        state,
        openJobForm,
        openCallForm,
        closeJobForm,
        closeCallForm,
        closeAll,
        setEditingJob,
        setEditingCall,
      }}
    >
      {children}
    </FormSidebarContext.Provider>
  );
}
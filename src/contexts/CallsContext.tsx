import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/api";
import { Call } from "../types/models";
import { useAuth } from "../auth/useAuth"

type CallsContextType = {
  calls: Call[];
  addCall: (call: Call) => void;
  updateCall: (call: Call) => void;
  removeCall: (id: string) => void;
  refreshCalls: () => Promise<void>;
};

const CallsContext = createContext<CallsContextType | undefined>(undefined);

export function CallsProvider({ children }: { children: ReactNode }) {
  const [calls, setCalls] = useState<Call[]>([]);
  const { user } = useAuth();

  // On mount, fetch calls from API
  // useEffect(() => {
  //   refreshCalls();
  // }, []);

   useEffect(() => {
    if (user) {
      refreshCalls();
    }
    // Optionally: clear calls on logout
    else {
      setCalls([]);
    }
  }, [user]);

  const refreshCalls = async () => {
    const res = await api.get<Call[]>("/calls");
    setCalls(res.data);
  };

  const addCall = (call: Call) => setCalls(calls => [call, ...calls]);
  const updateCall = (call: Call) =>
    setCalls(calls => calls.map(c => c._id === call._id ? call : c));
  const removeCall = (id: string) =>
    setCalls(calls => calls.filter(c => c._id !== id));

  return (
    <CallsContext.Provider value={{ calls, addCall, updateCall, removeCall, refreshCalls }}>
      {children}
    </CallsContext.Provider>
  );
}

export function useCalls() {
  const ctx = useContext(CallsContext);
  if (!ctx) throw new Error("useCalls must be used within CallsProvider");
  return ctx;
}

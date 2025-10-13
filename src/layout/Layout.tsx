import React from "react";
import { Outlet, Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useLoading } from "../contexts/LoadingContext";
import LoadingScreen from "../components/LoadingScreen";
import { useFormSidebar } from "../contexts/FormSidebarContext";
import JobForm from "../components/JobForm";
import CallForm from "../components/CallForm";
import { useJobs } from "../contexts/JobsContext";
import { useEmployers } from "../contexts/EmployersContext";
import { useCalls } from "../contexts/CallsContext";

export default function Layout() {
  const { loading } = useLoading();
  const { state, closeJobForm, closeCallForm, openJobForm, openCallForm, setEditingJob, setEditingCall } = useFormSidebar();
  const { jobs } = useJobs();
  const { employers } = useEmployers();
  const { calls } = useCalls();

  // Determine layout widths
  const sidebarOpen = state.jobFormOpen || state.callFormOpen;
  const mainWidth = sidebarOpen ? "w-2/3" : "w-full";
  const sidebarWidth = "w-1/3";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between bg-gray-100 p-4 shadow">
        <Link to="/" className="text-xl font-bold text-blue-700">
          Job Tracker
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/jobs" className="hover:underline">Jobs</Link>
          <Link to="/calls" className="hover:underline">Calls</Link>
          <Link to="/employers" className="hover:underline">Employers</Link>
          <Link to="/interviews" className="hover:underline">Interviews</Link>
          <Link to="/reports" className="hover:underline">Reports</Link>
          {/* <button
            onClick={() => { setEditingJob(undefined); openJobForm(); }}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            + Add Job
          </button>
          <button
            onClick={() => { setEditingCall(undefined); openCallForm(); }}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            + Add Call
          </button> */}
          <LogoutButton />
        </nav>
      </header>

      <div className="flex flex-1 bg-gray-50 relative overflow-hidden">
        <main className={`p-6 ${mainWidth} transition-all duration-300 ease-in-out`}>
          {loading && <LoadingScreen />}
          <Outlet />
        </main>
        {sidebarOpen && (
          <aside className={`bg-white shadow-lg border-l ${sidebarWidth} transition-all duration-300 ease-in-out fixed right-0 top-[65px] bottom-[57px] overflow-hidden`}>
            {/* Sidebar content: render JobForm and/or CallForm based on context */}
            <div className="absolute inset-0">
              {state.jobFormOpen && state.callFormOpen ? (
                <div className="h-full flex flex-col">
                  <div className="flex-none h-1/2 border-b border-gray-200">
                    <div className="h-full p-4 overflow-y-auto">
                      <JobForm
                        jobToEdit={state.editingJob}
                        employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
                        onSuccess={closeJobForm}
                        onCancel={closeJobForm}
                      />
                    </div>
                  </div>
                  <div className="flex-none h-1/2">
                    <div className="h-full p-4 overflow-y-auto">
                      <CallForm
                        callToEdit={state.editingCall}
                        employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
                        jobs={jobs}
                        onSuccess={closeCallForm}
                        onCancel={closeCallForm}
                      />
                    </div>
                  </div>
                </div>
              ) : state.jobFormOpen ? (
                <div className="h-full">
                  <div className="h-full p-4 overflow-y-auto">
                    <JobForm
                      jobToEdit={state.editingJob}
                      employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
                      onSuccess={closeJobForm}
                      onCancel={closeJobForm}
                    />
                  </div>
                </div>
              ) : state.callFormOpen ? (
                <div className="h-full">
                  <div className="h-full p-4 overflow-y-auto">
                    <CallForm
                      callToEdit={state.editingCall}
                      employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
                      jobs={jobs}
                      onSuccess={closeCallForm}
                      onCancel={closeCallForm}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        )}
      </div>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Job Tracker
      </footer>
    </div>
  );
}

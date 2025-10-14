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
          <button
            onClick={() => { setEditingJob(undefined); openJobForm(); }}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition hidden sm:block"
          >
            + Add Job
          </button>
          <button
            onClick={() => { setEditingCall(undefined); openCallForm(); }}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition hidden sm:block"
          >
            + Add Call
          </button>
          {/* Mobile buttons */}
          <div className="sm:hidden flex space-x-2">
            <button
              onClick={() => { setEditingJob(undefined); openJobForm(); }}
              className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition text-lg font-bold"
            >
              +
            </button>
            <button
              onClick={() => { setEditingCall(undefined); openCallForm(); }}
              className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-700 transition text-lg font-bold"
            >
              +
            </button>
          </div>
          <LogoutButton />
        </nav>
      </header>

      <div className="flex flex-1 bg-gray-50 relative overflow-hidden">
        <main className={`p-6 ${mainWidth} transition-all duration-300 ease-in-out`}>
          {loading && <LoadingScreen />}
          <Outlet />
        </main>
        
        {/* Desktop Sidebar */}
        {sidebarOpen && (
          <aside className={`bg-white shadow-lg border-l ${sidebarWidth} transition-all duration-300 ease-in-out fixed right-0 top-[65px] bottom-[57px] overflow-hidden hidden sm:block`}>
            <div className="absolute inset-0">
              <div className="h-full flex flex-col">
                {state.jobFormOpen && (
                  <div className={`${state.callFormOpen ? 'h-1/2' : 'h-full'} ${state.callFormOpen ? 'border-b border-gray-200' : ''}`}>
                    <div className="h-full p-4 overflow-y-auto">
                      <JobForm
                        jobToEdit={state.editingJob}
                        employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
                        onSuccess={closeJobForm}
                        onCancel={closeJobForm}
                      />
                    </div>
                  </div>
                )}
                {state.callFormOpen && (
                  <div className={`${state.jobFormOpen ? 'h-1/2' : 'h-full'}`}>
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
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Mobile Modal */}
        {sidebarOpen && (
          <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4">
            <div className="bg-white rounded-lg shadow-lg w-[95%] max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {state.jobFormOpen ? "Add Job" : "Add Call"}
                </h2>
                <button
                  onClick={state.jobFormOpen ? closeJobForm : closeCallForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                {state.jobFormOpen ? (
                  <JobForm
                    jobToEdit={state.editingJob}
                    employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
                    onSuccess={closeJobForm}
                    onCancel={closeJobForm}
                  />
                ) : state.callFormOpen ? (
                  <CallForm
                    callToEdit={state.editingCall}
                    employerOptions={employers.map((e) => ({ value: e._id!, label: e.name }))}
                    jobs={jobs}
                    onSuccess={closeCallForm}
                    onCancel={closeCallForm}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Job Tracker
      </footer>
    </div>
  );
}

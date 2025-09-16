import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import EmployersPage from "./pages/EmployersPage";
import CallsPage from "./pages/CallsPage";
import LoginPage from "./pages/LoginPage";
import ReportsPage from "./pages/ReportsPage";
// import RegisterPage from "./pages/RegisterPage";
// import NotFound from "./pages/NotFound";
import { useAuth } from "./auth/useAuth";
import { JobsProvider } from "./contexts/JobsContext";
import { CallsProvider } from "./contexts/CallsContext";
import { EmployersProvider } from "./contexts/EmployersContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { useLoading } from "./contexts/LoadingContext";
import LoadingScreen from "./components/LoadingScreen";

// PrivateRoute component for RBAC
const PrivateRoute = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { user } = useAuth();
  // if (user === null) {
  //   // Still loading/hydrating auth state...
  //   return <div>Loading...</div>
  // }
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function GlobalLoadingOverlay() {
  const { loading } = useLoading();
  return loading ? <LoadingScreen /> : null;
}

const App: React.FC = () => (
  <LoadingProvider>
    <GlobalLoadingOverlay />
    <JobsProvider>
      <CallsProvider>
        <EmployersProvider>
          <BrowserRouter>
            <Routes>
              {/* Default to login if root */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              {/* <Route path="/register" element={<RegisterPage />} /> */}
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/:id" element={<JobDetailPage />} />
                <Route path="employers" element={<EmployersPage />} />
                <Route path="calls" element={<CallsPage />} />
                <Route path="reports" element={<ReportsPage />} />
              </Route>
              {/* Not found fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </EmployersProvider>
      </CallsProvider>
    </JobsProvider>
  </LoadingProvider>
);

export default App;

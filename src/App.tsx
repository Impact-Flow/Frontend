import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { ProjectDetails } from "./pages/ProjectDetails";
import { CreateProject } from "./pages/CreateProject";
import { Dashboard } from "./pages/Dashboard";
import { VerifierDashboard } from "./pages/VerifierDashboard";
import { NotFound } from "./pages/NotFound";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="create" element={<CreateProject />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="verifier" element={<VerifierDashboard />} />

          {/* Backward compatibility redirects */}
          <Route path="creator" element={<Navigate to="/dashboard" replace />} />
          <Route path="contributor" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

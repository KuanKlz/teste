import React, { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./Layout";
import Dashboard from "./Pages/Dashboard";
import Appointments from "./Pages/Appointments";
import Barbers from "./Pages/Barbers";
import Services from "./Pages/Services";
import Reports from "./Pages/Reports";
import Login from "./Pages/Login";

import { getAuth, logout } from "./auth";

function Protected({ authed, children }) {
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(() => getAuth());
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login onLogged={(s) => setSession(s)} />}
          />

          <Route
            element={
              <Protected authed={!!session}>
                <Layout
                  onLogout={() => {
                    logout();
                    setSession(null);
                  }}
                />
              </Protected>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/barbers" element={<Barbers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

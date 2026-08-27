import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { Outlet } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import History from "./pages/History";
import Tickets from "./pages/Tickets";
import Documents from "./pages/Documents";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =========================
              PUBLIC PAGES
          ========================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =========================
              PROTECTED APPLICATION
          ========================== */}

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/tickets"
              element={<Tickets />}
            />

            <Route
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/users"
                element={<UserManagement />}
              />

              <Route
                path="/documents"
                element={<Documents />}
              />
            </Route>
          </Route>


          {/* =========================
              FALLBACK
          ========================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
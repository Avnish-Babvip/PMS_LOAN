import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout/DefaultLayout";
import AdminDefaultLayout from "../layout/DefaultLayout/AdminDefaultLayout";
import Login from "../pages/Authentication/Login";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { NotFound } from "../pages/NotFound";
import ResetPassword from "../pages/Authentication/ResetPassword";
import ProtectedRoute from "../components/ProtectedRoutes";
import MaintenanceMode from "../pages/Maintenance/MaintenanceMode";
import Role from "../pages/Role/Role";
import RolePermission from "../pages/Role/RolePermission";

export const appRouter = createBrowserRouter([
  /* ---------------- PUBLIC ROUTES ---------------- */
  {
    path: "/",
    element: <DefaultLayout />, // Public layout
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },

  /* ---------------- PROTECTED ROUTES ---------------- */
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminDefaultLayout />,
        children: [

        {
  index: true,
  element: (
    <ProtectedRoute requiredPermission="view dashboard">
      <Dashboard />
    </ProtectedRoute>
  ),
},
  {
          path: "role",
          element: (
            <ProtectedRoute requiredPermission="view roles">
              <Role />
            </ProtectedRoute>
          ),
        },
  {
          path: "role/:id/:role",
          element: (
            <ProtectedRoute requiredPermission="view roles">
              <RolePermission />
            </ProtectedRoute>
          ),
        },
          { path: "maintenance/mode", element: <MaintenanceMode /> },
        ],
      },
    ],
  },

  /* ---------------- FALLBACK ---------------- */
  {
    path: "*",
    element: <NotFound />,
  },
]);

import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
// import { UsersPage } from "@/features/user/pages/UsersPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";

export const router = createBrowserRouter([
  // Routes publiques
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/finalize", element: <RegisterPage /> },
  // Routes protégées (tous les utilisateurs connectés)
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <DashboardPage /> }],
  },

  // Routes admin uniquement
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    // children: [{ path: "/users", element: <UsersPage /> }],
  },
]);

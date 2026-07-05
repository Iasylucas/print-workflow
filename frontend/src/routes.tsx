import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { UsersPage } from "@/features/user/pages/UsersPage";
import { OrdersPage } from "./features/order";

export const router = createBrowserRouter([
  // Routes publiques
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/finalize", element: <RegisterPage /> },

  // Routes protégées (tous les utilisateurs connectés)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [{ path: "/", element: <DashboardPage /> }],
      },
    ],
  },

  // Routes admin uniquement (layout identique)
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <RootLayout />,
        children: [{ path: "/users", element: <UsersPage /> }],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN", "SALES"]} />,
    children: [
      {
        element: <RootLayout />,
        children: [{ path: "/pos", element: <OrdersPage /> }],
      },
    ],
  },
]);

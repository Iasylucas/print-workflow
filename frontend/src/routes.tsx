import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { UsersPage } from "@/features/user/pages/UsersPage";
import { PosPage } from "./features/pos";
import { ClientsPage } from "./features/client/pages/ClientsPage";
import { OrdersPage } from "./features/orders/pages/OrdersPage";
import { InvoicesPage } from "./features/invoices/pages/InvoicesPage";
import { QuotesPage } from "./features/quotes/pages/QuotesPage";
import { ProductsPage } from "./features/products/pages/ProductsPage";
import { ProfilePage } from "./features/profile/pages/ProfilePage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/pages/ResetPasswordPage";
import { CompanySettingsPage } from "./features/company-info/pages/CompanySettingsPage";

export const router = createBrowserRouter([
  // Routes publiques
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/finalize", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  // Routes protégées (tous les utilisateurs connectés)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [{ path: "/", element: <DashboardPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/profile", element: <ProfilePage /> }],
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
      {
        element: <RootLayout />,
        children: [{ path: "/products", element: <ProductsPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/orders", element: <OrdersPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/invoices", element: <InvoicesPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/settings", element: <CompanySettingsPage /> }],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN", "SALES"]} />,
    children: [
      {
        element: <RootLayout />,
        children: [{ path: "/pos", element: <PosPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/pos/:invoiceId", element: <PosPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/clients", element: <ClientsPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/quotes", element: <QuotesPage /> }],
      },
      {
        element: <RootLayout />,
        children: [{ path: "/invoices", element: <InvoicesPage /> }],
      },
    ],
  },
]);

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
import { PaymentAuditLogsPage } from "./features/payment-audit-log";
import { NotificationsPage } from "./features/notifications";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/finalize", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/products", element: <ProductsPage /> },
          { path: "/pos", element: <PosPage /> },
          { path: "/clients", element: <ClientsPage /> },
          { path: "/quotes", element: <QuotesPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/invoices", element: <InvoicesPage /> },
          { path: "/payment-audit-logs", element: <PaymentAuditLogsPage /> },
          { path: "/settings", element: <CompanySettingsPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
        ],
      },
    ],
  },
]);

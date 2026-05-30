import { useAuthStore } from "@/stores/authStore";
import { useShallow } from "zustand/react/shallow";

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    setAuth,
  } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      login: state.login,
      register: state.register,
      logout: state.logout,
      setAuth: state.setAuth,
    })),
  );

  // --- Rôles Utilisateurs (RBAC) ---
  const isAdmin = user?.role === "ADMIN";
  const isSales = user?.role === "SALES";
  const isPrinter = user?.role === "PRINTER";
  const isGraphicDesigner = user?.role === "GRAPHIC_DESIGNER";

  // --- Sécurité & Droits d'accès ---
  const canManageUsers = isAdmin;
  const canEditCompany = isAdmin;

  // --- Affichage Visuel ---
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName?.toUpperCase()}`.trim()
    : "";

  const avatarInitials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0)}`.toUpperCase()
    : "";

  return {
    // États bruts
    user,
    token,
    isLoading,
    isAuthenticated,

    // Rôles & Permissions
    isAdmin,
    isSales,
    isPrinter,
    isGraphicDesigner,
    canManageUsers,
    canEditCompany,

    // Données d'affichage formatées
    fullName,
    avatarInitials,

    // Actions de session
    login,
    register,
    logout,
    setAuth,
  };
};

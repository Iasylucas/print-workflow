import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { api } from "@/lib/axios";
import { Loader2 } from "lucide-react";
// import { UserRole } from "@/shared/schemas";

interface ProtectedRouteProps {
  // allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  // allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, token, setAuth, logout } =
    useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifySessionOnMount = async () => {
      if (!token || !isAuthenticated) {
        setTimeout(() => {
          setIsVerifying(false);
        }, 500);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        setAuth(response.data.user, token);
      } catch (error) {
        console.log(error);
        logout();
      } finally {
        setIsVerifying(false);
      }
    };

    verifySessionOnMount();
  }, [token, isAuthenticated, setAuth, logout]);

  if (isLoading || isVerifying) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin mx-auto text-primary stroke-[2.5]" />
          <p className="text-xs text-muted-foreground font-sans tracking-wide">
            Vérification de l'accès...
          </p>
        </div>
      </div>
    );
  }

  // 2. Barrière d'authentification stricte
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

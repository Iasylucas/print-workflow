import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "@/features/company-info/components/Logo";

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/orders", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="text-center space-y-2 max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-destructive">
            Lien invalide
          </h1>
          <p className="text-sm text-muted-foreground">
            Aucun jeton de validation n'a été trouvé dans votre lien
            d'invitation. Veuillez contacter votre administrateur.
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  const handleSuccess = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo variant="icon" className="w-30" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm token={token} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

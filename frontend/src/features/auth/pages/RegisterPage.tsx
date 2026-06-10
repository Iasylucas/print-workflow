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
      navigate("/", { replace: true });
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo variant="icon" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm token={token} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1527031169734-cc605463fe17?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
          loading="eager"
        />
      </div>
    </div>
  );
};

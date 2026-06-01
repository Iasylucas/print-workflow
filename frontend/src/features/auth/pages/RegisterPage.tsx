import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "../hooks/useAuth"; // Votre hook de performance

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { isAuthenticated } = useAuth(); // Récupère l'état depuis Zustand

  // Protection : Si l'utilisateur est déjà connecté, on le dégage vers le dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Si le token est absent de l'URL
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

  // Si l'utilisateur est connecté, on bloque le rendu le temps que le useEffect redirige
  if (isAuthenticated) return null;

  const handleSuccess = () => {
    navigate("/", { replace: true }); // Redirection vers la racine (votre dashboard)
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            EWA Print
          </a>
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

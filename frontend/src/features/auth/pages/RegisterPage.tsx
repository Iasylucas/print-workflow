import { useSearchParams, useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "../components/RegisterForm";

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Lien invalide</h1>
          <p className="text-muted-foreground">
            Aucun token de validation trouvé.
          </p>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    navigate("/dashboard", { replace: true });
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
          src="https://images.unsplash.com/photo-1527031169734-cc605463fe17?q=80&w=1470&auto=format&fit=crop"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
          loading="eager"
        />
      </div>
    </div>
  );
};

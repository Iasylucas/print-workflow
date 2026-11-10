import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Logo } from "@/features/company-info/components/Logo";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [imgLoaded, setImageLoaded] = useState(false);
  const handleSuccess = () => {
    navigate("/orders", { replace: true });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:m-2 lg:block lg:rounded-2xl lg:shadow-sm lg:overflow-hidden lg:border lg:border-border">
        {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
        <img
          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
          onLoad={() => setImageLoaded(true)}
          alt="LoadingSideImage"
          className={cn(
            "absolute inset-0 h-full w-full object-cover dark:brightness-[0.7] transition-opacity duration-500",
            "blur-[1px] scale-105", // flou réduit
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
          loading="eager"
        />

        {/* Overlay dégradé pour la lisibilité et la profondeur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Conteneur glass animé */}
        <div className="absolute bottom-10 left-10 z-10 max-w-md animate-in fade-in slide-in-from-bottom-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-xl shadow-2xl">
            {/* Reflet subtil animé */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-10 space-y-3">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90">
                E-WaPrint
              </span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight">
                Votre espace, <br />
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  simplifié.
                </span>
              </h2>
              <p className="text-sm leading-relaxed text-white/80">
                Votre espace de travail centralisé pour collaborer, gérer vos
                demandes et accéder à vos ressources en toute simplicité.
              </p>
              <div className="pt-2">
                <p className="text-xs text-white/60">
                  Accès réservé aux employés invités par l'administrateur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-center">
          <Logo variant="icon" className="w-30" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

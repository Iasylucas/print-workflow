import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Logo } from "@/features/company-info/components/Logo";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Layers,
  Palette,
  Printer,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [imgLoaded, setImageLoaded] = useState(false);
  const handleSuccess = () => {
    navigate("/orders", { replace: true });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:m-1 lg:block lg:rounded-2xl lg:shadow-sm lg:overflow-hidden lg:border lg:border-border">
        {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
        <img
          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
          onLoad={() => setImageLoaded(true)}
          alt="LoadingSideImage"
          className={cn(
            "absolute inset-0 h-full w-full object-cover dark:brightness-[0.7] transition-opacity duration-500",
            "blur-[1px] scale-105",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 lg:p-10 pointer-events-none">
          <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 pointer-events-auto">
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 lg:p-8 text-white backdrop-blur-xl shadow-2xl">
              <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5 items-center">
                    <span className="h-3 w-3 rounded-full bg-[#00A3E0]" />
                    <span className="h-3 w-3 rounded-full bg-[#EC008C]" />
                    <span className="h-3 w-3 rounded-full bg-[#FFD100]" />
                    <span className="h-3 w-3 rounded-full bg-[#111827] border border-white/40" />
                  </div>

                  <span className="text-lg font-bold tracking-tight">
                    EwaPrint
                  </span>

                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-md">
                    DTF Studio
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                    <Layers className="h-3.5 w-3.5" />
                    Production Management System
                  </span>

                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                    L'ERP dédié aux ateliers
                    <span className="block bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                      d'impression DTF.
                    </span>
                  </h2>

                  <p className="max-w-lg text-sm lg:text-base leading-relaxed text-white/75">
                    De la commande client à la livraison, centralisez vos
                    activités, coordonnez vos équipes et suivez chaque étape de
                    votre production depuis une plateforme unique.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                    Un espace de travail pour chaque équipe
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="group rounded-xl border border-white/15 bg-white/[0.08] p-3 transition-all duration-300 hover:bg-white/[0.15] hover:border-white/30">
                      <div className="mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-blue-300" />
                        <span className="text-sm font-semibold">
                          Administrateur
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-white/65">
                        Supervision globale, gestion des équipes et trésorerie.
                      </p>
                    </div>

                    <div className="group rounded-xl border border-white/15 bg-white/[0.08] p-3 transition-all duration-300 hover:bg-white/[0.15] hover:border-white/30">
                      <div className="mb-2 flex items-center gap-2">
                        <ReceiptText className="h-4 w-4 text-amber-300" />
                        <span className="text-sm font-semibold">
                          Commercial
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-white/65">
                        Gestion des clients, devis et suivi des commandes.
                      </p>
                    </div>

                    <div className="group rounded-xl border border-white/15 bg-white/[0.08] p-3 transition-all duration-300 hover:bg-white/[0.15] hover:border-white/30">
                      <div className="mb-2 flex items-center gap-2">
                        <Palette className="h-4 w-4 text-pink-300" />
                        <span className="text-sm font-semibold">Graphiste</span>
                      </div>

                      <p className="text-xs leading-relaxed text-white/65">
                        Préparation graphique, contrôle PAO et validation des
                        BAT.
                      </p>
                    </div>

                    <div className="group rounded-xl border border-white/15 bg-white/[0.08] p-3 transition-all duration-300 hover:bg-white/[0.15] hover:border-white/30">
                      <div className="mb-2 flex items-center gap-2">
                        <Printer className="h-4 w-4 text-emerald-300" />
                        <span className="text-sm font-semibold">Imprimeur</span>
                      </div>

                      <p className="text-xs leading-relaxed text-white/65">
                        Suivi de production, impression et découpe.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/15 pt-4">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />

                  <p className="text-xs text-white/60">
                    Accès sécurisé réservé aux employés autorisés par
                    l'administrateur.
                  </p>
                </div>
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

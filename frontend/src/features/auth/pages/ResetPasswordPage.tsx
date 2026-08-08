import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authApi } from "../services/authApi";
import { toast } from "sonner";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/features/company-info/components/Logo";
import { resetPasswordSchema } from "../schemas/auth.schema";
import type { ResetPasswordRequest } from "../types/auth.types";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordRequest) => {
    if (!token) {
      toast.error("Token invalide");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword: data.password });
      setIsSuccess(true);
      toast.success("Mot de passe réinitialisé avec succès");
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      toast.error("Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-muted/30 px-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <Logo variant="icon" />
          </div>
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6">
            <p className="text-destructive font-medium">Lien invalide</p>
            <p className="text-sm text-muted-foreground mt-2">
              Le lien de réinitialisation est invalide ou a expiré.
            </p>
            <Button asChild className="w-full mt-4">
              <Link to="/forgot-password">Demander un nouveau lien</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo variant="icon" className="h-50 w-50" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">
            Nouveau mot de passe
          </h2>

          <p className="text-muted-foreground mt-2 text-sm">
            {isSuccess
              ? "Mot de passe réinitialisé !"
              : "Entrez votre nouveau mot de passe"}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Votre mot de passe a été réinitialisé avec succès.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Aller à la connexion</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nouveau mot de passe
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      className="bg-background h-11 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirmer le mot de passe
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      className="bg-background h-11 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {form.formState.errors.root && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Réinitialisation...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

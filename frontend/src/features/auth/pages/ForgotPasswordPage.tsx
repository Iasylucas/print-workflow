import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authApi } from "../services/authApi";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Logo } from "@/features/company-info/components/Logo";
import { forgotPasswordSchema } from "../schemas/auth.schema";
import type { ForgotPasswordRequest } from "../types/auth.types";

export const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email: data.email });
      setIsSuccess(true);
      toast.success("Un email de réinitialisation vous a été envoyé");
    } catch {
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo variant="icon" className="w-50" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">
            Mot de passe oublié
          </h2>

          <p className="text-muted-foreground mt-2 text-sm">
            {isSuccess
              ? "Vérifiez votre boîte de réception"
              : "Saisissez votre email pour recevoir un lien"}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
              <Mail className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Un email de réinitialisation a été envoyé à votre adresse email.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Veuillez vérifier votre boîte de réception (et vos spams).
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Retour à la connexion</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Adresse email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    placeholder="exemple@email.com"
                    className="bg-background h-11"
                    disabled={isLoading}
                  />
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
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien"
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

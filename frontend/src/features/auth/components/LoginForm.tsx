import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema, type LoginRequest } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";

interface LoginFormProps extends React.ComponentProps<"form"> {
  onSuccess?: () => void;
}

export function LoginForm({ className, onSuccess, ...props }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";

      form.setError("root", {
        message: errorMessage,
      });
    }
  };

  return (
    <form
      className={cn("w-full max-w-sm flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Connexion à votre compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre email et mot de passe
        </p>
      </div>

      <FieldGroup className="flex flex-col gap-4">
        {/* Champ Email - Nouveau Format Shadcn */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
                className="bg-background"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error || ""]} />
              )}
            </Field>
          )}
        />

        {/* Champ Mot de passe - Nouveau Format Shadcn */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between w-full">
                <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
                <a
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-primary"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              <div className="relative w-full">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  className="bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error || ""]} />
              )}
            </Field>
          )}
        />

        {/* Alerte Erreur Globale du Serveur */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Bouton Soumission */}
        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? <Spinner data-icon="inline-start" /> : " Se connecter"}
        </Button>

        <FieldDescription className="text-center text-xs ">
          Vous n'avez pas de compte ? Veuillez contacter votre administrateur
          pour obtenir une invitation.
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

// frontend/src/features/auth/components/RegisterForm.tsx
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
import { registerSchema } from "../schemas/auth.schema";
import type { FinalizeRegistrationRequest } from "../types/auth.types";
import { useAuth } from "../hooks/useAuth";

interface RegisterFormProps extends React.ComponentProps<"form"> {
  token: string;
  onSuccess?: () => void;
}

export function RegisterForm({
  token,
  className,
  onSuccess,
  ...props
}: RegisterFormProps) {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FinalizeRegistrationRequest>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      token,
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FinalizeRegistrationRequest) => {
    try {
      await registerUser(data);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <form
      className={cn("w-full max-w-md flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Finalisation de votre inscription
        </h1>
        <p className="text-sm text-muted-foreground">
          Complétez vos informations personnelles
        </p>
      </div>

      <FieldGroup className="flex flex-col gap-4">
        {/* Prénom */}
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Prénom</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="Jean"
                className="bg-background"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error || ""]} />
              )}
            </Field>
          )}
        />

        {/* Nom */}
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="Dupont"
                className="bg-background"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error || ""]} />
              )}
            </Field>
          )}
        />

        {/* Téléphone */}
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Téléphone</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                type="tel"
                aria-invalid={fieldState.invalid}
                placeholder="034 12 345 67"
                className="bg-background"
              />
              <FieldDescription>
                Utilisé pour les communications urgentes
              </FieldDescription>
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error || ""]} />
              )}
            </Field>
          )}
        />

        {/* Adresse (optionnelle) */}
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Adresse (optionnel)</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="123 Rue de Paris"
                className="bg-background"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error || ""]} />
              )}
            </Field>
          )}
        />

        {/* Mot de passe */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
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
              <FieldDescription>
                8 caractères, une majuscule, un chiffre, un caractère spécial
              </FieldDescription>
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error || ""]} />
              )}
            </Field>
          )}
        />

        {/* Confirmation mot de passe */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Confirmation du mot de passe
              </FieldLabel>
              <div className="relative w-full">
                <Input
                  {...field}
                  id={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  className="bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                >
                  {showConfirmPassword ? (
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

        {/* Erreur globale */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Bouton de soumission */}
        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? (
            <Spinner data-icon="inline-start" />
          ) : (
            "Créer mon compte"
          )}
        </Button>

        <FieldDescription className="text-center text-xs">
          En cliquant sur "Créer mon compte", vous acceptez nos conditions
          d'utilisation.
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

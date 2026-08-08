import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarUpload } from "./AvatarUpload";
import type { UserProfile, UpdateProfileRequest } from "../types/profile.types";
import { useEffect } from "react";

const profileSchema = z.object({
  firstName: z.string().trim().optional().nullable(),
  lastName: z.string().trim().min(2, "Le nom est requis"),
  phone: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: UserProfile | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  onSubmit: (data: UpdateProfileRequest) => void;
}

export const ProfileForm = ({
  profile,
  isLoading,
  isUpdating,
  onSubmit,
}: ProfileFormProps) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile, form]);

  const formValues = form.watch();
  const currentNormalized = {
    firstName: formValues.firstName || "",
    lastName: formValues.lastName || "",
    phone: formValues.phone || "",
    address: formValues.address || "",
  };

  const originalNormalized = {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  };

  const hasChanges = () => {
    return (
      currentNormalized.firstName !== originalNormalized.firstName ||
      currentNormalized.lastName !== originalNormalized.lastName ||
      currentNormalized.phone !== originalNormalized.phone ||
      currentNormalized.address !== originalNormalized.address
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!profile) return null;

  const handleAvatarUpload = (url: string) => {
    onSubmit({ ...form.getValues(), avatarUrl: url });
  };

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        onSubmit({
          firstName: data.firstName || null,
          lastName: data.lastName || "",
          phone: data.phone || null,
          address: data.address || null,
        });
      })}
    >
      <AvatarUpload
        avatarUrl={profile.avatarUrl}
        name={`${profile.firstName || ""} ${profile.lastName}`}
        onUploadSuccess={handleAvatarUpload}
      />

      <FieldGroup className="flex flex-col gap-4">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Prénom</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder="Jean"
                className="bg-background"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nom *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder="Dupont"
                className="bg-background"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Téléphone</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder="034 12 345 67"
                className="bg-background"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Adresse</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder="10 rue de Paris"
                className="bg-background"
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isUpdating || !hasChanges}>
            {isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

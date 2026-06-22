import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

import type { User, EditUserRequest } from "../types/user.types";
import { editUserSchema } from "../schema/user.schema";
import { useUserMutations } from "../hooks/useUsers";
import axios from "axios";
import type { CloudinarySignatureResponse } from "@/shared/types";
import { FormDialog } from "@/components/shared/FormDialog";
import { AvatarUpload } from "@/components/shared/AvatarUpload";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  user,
}: EditUserModalProps) {
  const { updateMutation } = useUserMutations();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<EditUserRequest>({
    resolver: zodResolver(editUserSchema),
    mode: "onTouched",
    values: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      role: user?.role ?? "SALES",
      avatarUrl: user?.avatarUrl ?? "",
    },
  });

  const handleClose = () => {
    setAvatarFile(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: EditUserRequest) => {
    if (!user) return;

    try {
      setIsUploading(true);
      let finalAvatarUrl = user.avatarUrl || undefined;

      if (avatarFile) {
        const { data: signData } = await api.post<CloudinarySignatureResponse>(
          "/cloudinary/signature",
          {
            folder: "avatars",
            publicId: user.id,
          },
        );

        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("folder", signData.folder);
        formData.append("public_id", signData.public_id);
        formData.append("signature", signData.signature);

        const cleanAxios = axios.create();
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;

        const uploadData = await cleanAxios.post(cloudinaryUrl, formData);

        finalAvatarUrl = uploadData.data.secure_url;
      }

      await updateMutation.mutateAsync({
        id: user.id,
        data: {
          ...data,
          avatarUrl: finalAvatarUrl,
        },
      });

      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la modification";

      form.setError("root", {
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = updateMutation.isPending || isUploading;

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={form.handleSubmit(onSubmit, (errors) =>
        console.log("Erreurs de validation bloquantes :", errors),
      )}
      title="Modifier le profil utilisateur"
      description="Formulaire de modification des informations professionnelles du collaborateur."
      submitLabel="Enregistrer"
      pendingLabel="Mise à jour..."
      isPending={isPending}
      maxWidthClassName="sm:max-w-120"
    >
      <AvatarUpload
        currentUrl={user?.avatarUrl}
        fallbackText={
          user?.firstName?.charAt(0).toUpperCase() ||
          user?.email.charAt(0).toUpperCase() ||
          "U"
        }
        onChange={(file) => setAvatarFile(file)}
        isPending={isPending}
      />

      <FieldGroup className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
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
                  disabled={isPending}
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
                <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  value={field.value ?? ""}
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                  className="bg-background"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Rôle Système</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger
                  id={field.name}
                  className="w-full bg-background"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="SALES">Commercial</SelectItem>
                  <SelectItem value="PRINTER">Imprimeur</SelectItem>
                  <SelectItem value="GRAPHIC_DESIGNER">Graphiste</SelectItem>
                </SelectContent>
              </Select>
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
      </FieldGroup>
    </FormDialog>
  );
}

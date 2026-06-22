import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { ApertureIcon, Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Imports de tes sous-composants Shadcn customisés pour les formulaires
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

// Imports de tes types, schémas et hooks mutateurs
import type { User, EditUserRequest } from "../types/user.types";
import { editUserSchema } from "../schema/user.schema";
import { useUserMutations } from "../hooks/useUsers";
import axios from "axios";
import type { CloudinarySignatureResponse } from "@/shared/types";
import { FormDialog } from "@/components/shared/FormDialog";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Configuration de React Hook Form calquée sur ton LoginForm
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

  // 1. Gestion propre du changement de fichier (sans useEffect)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. L'effet de nettoyage de la mémoire vive (mémoire de l'image uniquement)
  useEffect(() => {
    // Cette fonction de retour (cleanup) s'exécute automatiquement au démontage
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 3. La fonction de fermeture unifiée qui réinitialise les états de manière événementielle
  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: EditUserRequest) => {
    if (!user) return;

    try {
      setIsUploading(true);
      let finalAvatarUrl = user.avatarUrl || undefined;

      if (selectedFile) {
        // 1. Demande de signature complète au Backend (Le back fournit TOUTES les configurations)
        const { data: signData } = await api.post<CloudinarySignatureResponse>(
          "/cloudinary/signature",
          {
            folder: "avatars",
            publicId: user.id,
          },
        );

        // 2. Construction dynamique du FormData sans aucune valeur codée en dur
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("folder", signData.folder);
        formData.append("public_id", signData.public_id);
        formData.append("signature", signData.signature);

        // 3. Envoi physique direct vers l'URL dynamique de Cloudinary via l'instance isolée
        const cleanAxios = axios.create();
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;

        const uploadData = await cleanAxios.post(cloudinaryUrl, formData);

        finalAvatarUrl = uploadData.data.secure_url;
      }

      // 4. Mutation finale et sécurisée vers ton API Backend Prisma
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
      {/* Section Gestion et Aperçu Dynamique de l'Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group rounded-full overflow-hidden h-20 w-20 border border-border cursor-pointer">
          <Avatar className="h-full w-full">
            <AvatarImage
              src={previewUrl || user?.avatarUrl || ""}
              alt="Avatar"
            />
            <AvatarFallback className="text-lg font-bold bg-muted">
              {user?.firstName?.charAt(0).toUpperCase() ||
                user?.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-[10px] gap-0.5"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Changer</span>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isPending}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Formats acceptés : JPG, PNG
        </p>
      </div>

      <FieldGroup className="flex flex-col gap-4">
        {/* Grille Prénom / Nom */}
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

        {/* Sélecteur de Rôle Système */}
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

        {/* Alerte Erreur Globale du Serveur */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
      </FieldGroup>
    </FormDialog>
  );
}

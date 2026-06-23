import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { FormDialog } from "@/components/shared/FormDialog";
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

import { useUserMutations } from "../hooks/useUsers";
import type { InviteUserRequest } from "../types/user.types";
import { inviteUserSchema } from "../schema/user.schema";

interface InviteUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserModal({
  isOpen,
  onOpenChange,
}: InviteUserModalProps) {
  const { inviteMutation } = useUserMutations();

  const form = useForm<InviteUserRequest>({
    resolver: zodResolver(inviteUserSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      role: "SALES",
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: InviteUserRequest) => {
    try {
      await inviteMutation.mutateAsync(data);

      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'invitation";

      form.setError("root", {
        message: errorMessage,
      });
    }
  };

  const isPending = inviteMutation.isPending;

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={form.handleSubmit(onSubmit, (errors) =>
        console.log("Erreurs de validation bloquantes :", errors),
      )}
      title="Inviter un collaborateur"
      description="Formulaire permettant d'envoyer un lien d'activation sécurisé à un nouvel utilisateur."
      submitLabel="Envoyer l'invitation"
      pendingLabel="Envoi en cours..."
      isPending={isPending}
      maxWidthClassName="sm:max-w-md"
    >
      <FieldGroup className="flex flex-col gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Adresse Email</FieldLabel>
              <div className="relative w-full">
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                  placeholder="collaborateur@ewaprint.fr"
                  className="bg-background pl-9"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Rôle assigné</FieldLabel>
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

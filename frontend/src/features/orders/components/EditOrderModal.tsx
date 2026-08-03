import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrderMutations } from "../hooks/useOrders";
import type { Order } from "../types/orders.types";

// Schéma Zod simple (pas de fichier séparé pour l'instant)
import { z } from "zod";

const editOrderSchema = z.object({
  designation: z.string().min(1, "La désignation est requise"),
  label: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  quantity: z.number().int().positive("La quantité doit être supérieure à 0"),
  unitPrice: z.number().int().nonnegative("Le prix unitaire doit être positif"),
});

type EditOrderFormData = z.infer<typeof editOrderSchema>;

interface EditOrderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export const EditOrderModal = ({
  isOpen,
  onOpenChange,
  order,
}: EditOrderModalProps) => {
  const { updateOrderMutation } = useOrderMutations();

  const form = useForm<EditOrderFormData>({
    resolver: zodResolver(editOrderSchema),
    mode: "onTouched",
    values: {
      designation: order?.designation ?? "",
      label: order?.label ?? "",
      dimensions: order?.dimensions ?? "",
      quantity: order?.quantity ?? 1,
      unitPrice: order?.unitPrice ?? 0,
    },
  });

  const onSubmit = async (data: EditOrderFormData) => {
    if (!order) return;
    await updateOrderMutation.mutateAsync({
      id: order.id,
      data,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la commande</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="flex flex-col gap-4">
            <Controller
              name="designation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Désignation *</FieldLabel>
                  <Input {...field} id={field.name} placeholder="Flyers A4" />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="label"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Étiquette atelier"
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="dimensions"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Dimensions</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="A4 / 20x30cm"
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Quantité *</FieldLabel>
                  <Input type="number" {...field} id={field.name} min={1} />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="unitPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Prix unitaire (Ar) *
                  </FieldLabel>
                  <Input type="number" {...field} id={field.name} min={0} />
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={updateOrderMutation.isPending}>
                {updateOrderMutation.isPending
                  ? "Enregistrement..."
                  : "Enregistrer"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

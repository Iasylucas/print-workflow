import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import type { Product } from "../types/products.types";
import { useProductMutations } from "../hooks/useProducts";

interface ProductFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

const productFormVariantSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(2),
  pricingMode: z.enum([
    "FIXED",
    "PER_M2",
    "PER_UNIT",
    "FORMAT",
    "RECTO_VERSO",
    "PER_METER",
    "OPTION",
    "COMPOSITE",
  ]),
  config: z.record(z.string().min(1), z.number().int().nonnegative()),
});

const productFormSchema = z.object({
  name: z.string().trim().min(2),
  variants: z.array(productFormVariantSchema).min(1),
});

type ProductFormData = z.infer<typeof productFormSchema>;

const DEFAULT_VARIANTS = [
  {
    name: "Prédécoupé",
    pricingMode: "COMPOSITE" as const,
    config: { per_m2: 0, A4: 0 },
  },
  {
    name: "Sans découpe",
    pricingMode: "PER_M2" as const,
    config: { per_m2: 0 },
  },
  { name: "Recto", pricingMode: "RECTO_VERSO" as const, config: { A4: 0 } },
  {
    name: "Recto Verso",
    pricingMode: "RECTO_VERSO" as const,
    config: { A4: 0 },
  },
  { name: "Standard", pricingMode: "FIXED" as const, config: { unit: 0 } },
  { name: "Deluxe", pricingMode: "FIXED" as const, config: { unit: 0 } },
];

export const ProductFormModal = ({
  isOpen,
  onOpenChange,
  product = null,
}: ProductFormModalProps) => {
  const { createProductMutation, updateProductMutation } =
    useProductMutations();
  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      variants: DEFAULT_VARIANTS.map((v) => ({
        name: v.name,
        pricingMode: v.pricingMode,
        config: { ...v.config },
      })),
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      const variants = product.variants.map((v) => {
        const config =
          (v.pricingRules?.[0]?.config as Record<string, number>) || {};
        return {
          id: v.id,
          name: v.name,
          pricingMode: (v.pricingRules?.[0]?.pricingMode ||
            "FIXED") as ProductFormData["variants"][number]["pricingMode"],
          config: { ...config },
        };
      });

      form.reset({ name: product.name, variants });
    } else if (isOpen && !product) {
      form.reset({
        name: "",
        variants: DEFAULT_VARIANTS.map((v) => ({
          name: v.name,
          pricingMode: v.pricingMode,
          config: { ...v.config },
        })),
      });
    }
  }, [product, isOpen, form]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && product) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          data: {
            name: data.name,
            variants: data.variants.map((v, index) => ({
              id: product.variants[index]?.id,
              name: v.name,
              pricingRule: {
                id: product.variants[index]?.pricingRules?.[0]?.id,
                pricingMode: v.pricingMode,
                config: v.config,
              },
            })),
          },
        });
      } else {
        await createProductMutation.mutateAsync({
          name: data.name,
          variants: data.variants.map((v) => ({
            name: v.name,
            pricingRule: {
              pricingMode: v.pricingMode,
              config: v.config,
            },
          })),
        });
        form.reset();
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  //   const onError = (errors: any) => {
  //     console.error("❌ Erreurs de validation RHF:", errors);
  //   };

  const isPending =
    createProductMutation.isPending || updateProductMutation.isPending;

  const variants = form.watch("variants");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="flex flex-col gap-4">
            {}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nom du produit *</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex: Vinyle Autocollant"
                    className="bg-background"
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {}
            <div>
              <FieldLabel>Variantes et prix</FieldLabel>
              <div className="mt-2 space-y-3">
                {variants.map((variant, vIndex) => {
                  const configKeys = Object.keys(variant.config);

                  return (
                    <div
                      key={vIndex}
                      className="border border-border rounded-lg p-3 bg-muted/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {variant.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Mode: {variant.pricingMode}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {configKeys.map((key) => (
                          <Controller
                            key={key}
                            name={
                              `variants.${vIndex}.config.${key}` as `variants.${number}.config.${string}`
                            }
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-muted-foreground w-20 flex-shrink-0">
                                  {key}
                                </span>
                                <Input
                                  type="number"
                                  {...field}
                                  value={field.value ?? 0}
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    const num = raw === "" ? 0 : Number(raw);
                                    field.onChange(num);
                                  }}
                                  className="bg-background text-sm h-8 flex-1"
                                  placeholder="Prix (Ar)"
                                />
                                <span className="text-xs text-muted-foreground w-8 flex-shrink-0">
                                  Ar
                                </span>
                                {fieldState.error && (
                                  <span className="text-xs text-destructive">
                                    {fieldState.error.message}
                                  </span>
                                )}
                              </div>
                            )}
                          />
                        ))}
                      </div>

                      {form.formState.errors.variants?.[vIndex] && (
                        <p className="text-xs text-destructive mt-2">
                          Erreur sur cette variante
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Les variantes sont prédéfinies. Contactez un développeur pour en
                ajouter ou modifier.
              </p>
            </div>

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
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Enregistrement..."
                  : isEditing
                    ? "Modifier"
                    : "Créer"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

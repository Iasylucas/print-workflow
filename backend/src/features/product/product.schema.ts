import { z } from "zod";
import { PricingMode } from "@/generated/prisma/client.js";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

export const pricingConfigSchema = z.record(
  z.string().min(1, "La clé de tarification ne peut pas être vide"),
  z
    .number()
    .int("Le prix doit être un nombre entier")
    .positive("Le prix doit être supérieur à 0"),
);

export const createPricingRuleSchema = z.object({
  pricingMode: z.enum(Object.values(PricingMode) as [string, ...string[]], {
    error: "Le mode de tarification sélectionné est invalide",
  }),
  config: pricingConfigSchema,
});

export const createProductVariantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom de la variante doit contenir au moins 2 caractères"),
  pricingRule: createPricingRuleSchema,
});

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom du produit doit contenir au moins 2 caractères"),
  variants: z
    .array(createProductVariantSchema)
    .min(1, "Le produit doit posséder au moins une variante technique"),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom du produit doit contenir au moins 2 caractères")
    .optional(),
  variants: z
    .array(
      z.object({
        id: z.number().int().positive().optional(),
        name: z.string().trim().min(2, "Le nom de la variante est requis"),
        pricingRule: z.object({
          id: z.number().int().positive().optional(),
          pricingMode: z.enum(PricingMode),
          config: pricingConfigSchema,
        }),
      }),
    )
    .min(1, "Le produit doit conserver au moins une variante technique")
    .optional(),
});

export const productQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "slug"]).default("createdAt"),
});

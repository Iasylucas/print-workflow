import { z } from "zod";

// ⚠️ Ce schéma est côté front, il sert à valider le formulaire
// Il doit être cohérent avec ce que le backend attend (CreateProductInput)

export const pricingConfigSchema = z.record(
  z.string().min(1),
  z.number().int().positive(),
);

export const createPricingRuleSchema = z.object({
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
  config: pricingConfigSchema,
});

export const createProductVariantSchema = z.object({
  name: z.string().trim().min(2),
  pricingRule: createPricingRuleSchema,
});

export const createProductSchema = z.object({
  name: z.string().trim().min(2),
  variants: z.array(createProductVariantSchema).min(1),
});

export const updateProductSchema = createProductSchema.partial();

// Query params pour la liste
export const productsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "slug"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductsQueryParams = z.infer<typeof productsQuerySchema>;

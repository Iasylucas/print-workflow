import { z } from "zod";
import { PricingMode } from "@/generated/prisma/client.js";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

// Schéma générique pour valider le dictionnaire de prix JSON (Clé textuelle -> Prix entier)
// Il accepte n'importe quelle clé ("A4", "per_m2", "unit", etc.) mais force une valeur entière positive
export const pricingConfigSchema = z.record(
  z.string().min(1, "La clé de tarification ne peut pas être vide"),
  z
    .number()
    .int("Le prix doit être un nombre entier")
    .positive("Le prix doit être supérieur à 0"),
);

// Schéma pour la création d'une règle tarifaire imbriquée
// 🛠️ La syntaxe officielle mise à jour pour Zod v4 (Remplacement de nativeEnum)
export const createPricingRuleSchema = z.object({
  pricingMode: z.enum(Object.values(PricingMode) as [string, ...string[]], {
    error: "Le mode de tarification sélectionné est invalide",
  }),
  config: pricingConfigSchema,
});

// Schéma pour la création d'une variante imbriquée
export const createProductVariantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom de la variante doit contenir au moins 2 caractères"),
  pricingRule: createPricingRuleSchema, // Agrégation directe
});

// =========================================================================
// SCHÉMAS DE VALIDATION DES REQUÊTES API (SOU-MISES AU CONTROLLER)
// =========================================================================

// 1. Validation pour la CRÉATION d'un produit complet avec ses variantes
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom du produit doit contenir au moins 2 caractères"),
  variants: z
    .array(createProductVariantSchema)
    .min(1, "Le produit doit posséder au moins une variante technique"),
});

// 2. Validation pour la MISE À JOUR d'un produit complet
export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom du produit doit contenir au moins 2 caractères")
    .optional(),
  variants: z
    .array(
      z.object({
        id: z.number().int().positive().optional(), // Présent s'il s'agit d'une modification d'une variante existante
        name: z.string().trim().min(2, "Le nom de la variante est requis"),
        pricingRule: z.object({
          id: z.number().int().positive().optional(), // Présent s'il s'agit d'une modification d'une règle existante
          pricingMode: z.enum(PricingMode),
          config: pricingConfigSchema,
        }),
      }),
    )
    .min(1, "Le produit doit conserver au moins une variante technique")
    .optional(),
});

export const productQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(), // Recherche par mot-clé sur le nom ou slug
  sortBy: z.enum(["createdAt", "name", "slug"]).default("createdAt"), // Colonnes de tri autorisées pour l'indexation
});

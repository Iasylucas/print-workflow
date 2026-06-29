import { z } from "zod";

// Schéma pour valider une ligne de commande unique du panier POS
export const createSingleOrderLineSchema = z.object({
  designation: z
    .string()
    .trim()
    .min(3, "La désignation du produit est requise"),
  variantId: z.number().int().positive("L'ID de la variante est invalide"),
  pricingRuleId: z
    .number()
    .int()
    .positive("L'ID de la règle de tarification est invalide"),

  // Dimensions optionnelles (Saisies uniquement pour le Grand Format m²)
  widthCm: z
    .number()
    .positive("La largeur doit être supérieure à 0")
    .optional()
    .nullable(),
  heightCm: z
    .number()
    .positive("La hauteur doit être supérieure à 0")
    .optional()
    .nullable(),

  // Options dynamiques (ex: { format: "A4", rectoVerso: true })
  options: z.record(z.string(), z.any()).optional().nullable(),

  quantity: z
    .number()
    .int()
    .positive("La quantité doit être un entier supérieur à 0"),
  unitPrice: z
    .number()
    .int()
    .nonnegative("Le prix unitaire doit être positif ou nul"),
  totalPrice: z
    .number()
    .int()
    .nonnegative("Le prix total de la ligne doit être positif ou nul"),

  // Note de production initiale saisie par le commercial pour l'atelier
  atelierNote: z.string().trim().optional().nullable(),
});

// Schéma central pour la validation du Panier Bulk du POS
export const createBulkOrderSchema = z.object({
  clientId: z.string().min(1, "Le client est obligatoire"),

  // Type de document de destination choisi par le commercial
  documentType: z.enum(["INVOICE", "QUOTE"], {
    error:
      "Le type de document doit être soit une Facture (INVOICE) soit un Devis (QUOTE)",
  }),

  // Gestion financière de l'acompte (Exigé en Ariary entier)
  deposit: z
    .number()
    .int()
    .nonnegative("L'acompte doit être un nombre positif ou nul")
    .default(0),

  // Informations de livraison optionnelles pour la facture
  deliveryPlace: z.string().trim().optional().nullable(),
  expectedDeliveryDate: z.coerce.date().optional().nullable(),

  // Le tableau des lignes du panier (Minimum 1 produit)
  lines: z
    .array(createSingleOrderLineSchema)
    .min(1, "Le panier doit contenir au moins une ligne de commande"),
});

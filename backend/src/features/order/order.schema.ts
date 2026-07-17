import { z } from "zod";
import { addPaymentSchema } from "../invoices/invoices.schema.js";

// Schéma pour valider une ligne de commande unique du panier POS
export const createSingleOrderLineSchema = z.object({
  designation: z
    .string()
    .trim()
    .min(3, "La désignation du produit est requise"),

  // Relation optionnelle vers le catalogue produit
  productId: z
    .number()
    .int()
    .positive("L'ID du produit est invalide")
    .optional()
    .nullable(),

  // Dimensions en texte libre (ex: "A4", "20x30cm", "1.5m x 3.5m")
  dimensions: z.string().trim().optional().nullable(),

  // Étiquette pour l'atelier (optionnelle)
  label: z.string().trim().optional().nullable(),
  atelierNote: z.string().trim().optional().nullable(),
  quantity: z
    .number()
    .int()
    .positive("La quantité doit être un entier supérieur à 0"),

  unitPrice: z
    .number()
    .int()
    .nonnegative("Le prix unitaire doit être positif ou nul"),
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
  paymentMethod: z.string().default("CASH"),
});

// order.schema.ts
export const updateOrderFromPosSchema = z.object({
  // Mise à jour de la facture
  deposit: z.number().int().nonnegative().optional(),
  deliveryPlace: z.string().trim().optional().nullable(),
  expectedDeliveryDate: z.coerce.date().optional().nullable(),

  // Mise à jour des lignes de commande
  lines: z
    .array(
      z.object({
        orderId: z.number().int().positive(),
        designation: z.string().trim().min(1),
        label: z.string().trim().optional().nullable(),
        dimensions: z.string().trim().optional().nullable(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().int().nonnegative(),
        atelierNote: z.string().trim().optional().nullable(),
      }),
    )
    .optional(),

  // Nouveau paiement (si ajouté)
  newPayment: addPaymentSchema.optional(),
});

import { z } from "zod";
import { addPaymentSchema } from "../invoices/invoices.schema.js";

export const createSingleOrderLineSchema = z.object({
  designation: z
    .string()
    .trim()
    .min(3, "La désignation du produit est requise"),

  productId: z
    .number()
    .int()
    .positive("L'ID du produit est invalide")
    .optional()
    .nullable(),

  dimensions: z.string().trim().optional().nullable(),

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

export const createBulkOrderSchema = z.object({
  clientId: z.string().min(1, "Le client est obligatoire"),

  documentType: z.enum(["INVOICE", "QUOTE"], {
    error:
      "Le type de document doit être soit une Facture (INVOICE) soit un Devis (QUOTE)",
  }),

  deposit: z
    .number()
    .int()
    .nonnegative("L'acompte doit être un nombre positif ou nul")
    .default(0),

  deliveryPlace: z.string().trim().optional().nullable(),
  expectedDeliveryDate: z.coerce.date().optional().nullable(),

  lines: z
    .array(createSingleOrderLineSchema)
    .min(1, "Le panier doit contenir au moins une ligne de commande"),
  paymentMethod: z.string().default("CASH"),
});

export const updateOrderFromPosSchema = z.object({
  deliveryPlace: z.string().trim().optional().nullable(),
  expectedDeliveryDate: z.coerce.date().optional().nullable(),

  lines: z
    .array(
      z.object({
        orderId: z.number().int().positive().nullable().optional(),
        productId: z.number().int().positive().nullable().optional(),
        designation: z.string().trim().min(1),
        label: z.string().trim().optional().nullable(),
        dimensions: z.string().trim().optional().nullable(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().int().nonnegative(),
        atelierNote: z.string().trim().optional().nullable(),
      }),
    )
    .optional(),

  newPayment: addPaymentSchema.optional(),
});

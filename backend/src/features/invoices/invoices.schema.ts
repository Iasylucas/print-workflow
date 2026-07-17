// backend/src/features/invoices/invoices.schema.ts
import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

// ============================================================
// 1. MISE À JOUR PARTIELLE D'UNE FACTURE
// ============================================================
export const updateInvoiceSchema = z.object({
  deposit: z.number().int().nonnegative().optional(),
  deliveryPlace: z.string().trim().optional().nullable(),
  expectedDeliveryDate: z.coerce.date().optional().nullable(),
});

// ============================================================
// 2. MARQUER COMME LIVRÉE (avec propagation aux commandes)
// ============================================================
export const markInvoiceDeliveredSchema = z.object({
  isDelivered: z.boolean().default(true),
});

// ============================================================
// 3. AJOUT D'UN PAIEMENT
// ============================================================
export const addPaymentSchema = z.object({
  amount: z.number().int().positive("Le montant doit être supérieur à 0"),
  method: z.enum(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CHECK"]),
  reference: z.string().trim().optional().nullable(),
});

// ============================================================
// 4. MISE À JOUR D'UN PAIEMENT EXISTANT
// ============================================================
export const updatePaymentSchema = z.object({
  amount: z
    .number()
    .int()
    .positive("Le montant doit être supérieur à 0")
    .optional(),
  method: z.enum(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CHECK"]).optional(),
  reference: z.string().trim().optional().nullable(),
});

// ============================================================
// 5. REQUÊTE DE LISTE (pagination, filtres, tri)
// ============================================================
export const invoicesQuerySchema = paginationSchema.extend({
  status: z.enum(["unpaid", "partial", "paid"]).optional(),
  clientId: z.string().uuid().optional(),
  search: z.string().trim().optional(),
  isDelivered: z
    .union([
      z.boolean(),
      z.enum(["true", "false"]).transform((val) => val === "true"),
    ])
    .optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "number", "total", "clientId"])
    .default("createdAt"),
});

// ============================================================
// 6. PARAMÈTRES D'ID (url param)
// ============================================================
export const invoiceIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de la facture est invalide"),
});

export const paymentIdParamSchema = z.object({
  paymentId: z.coerce.number().int().positive("L'ID du paiement est invalide"),
});

// frontend/src/features/invoices/schema/invoices.schema.ts
import { z } from "zod";

// ============================================================
// 1. STATUTS DE PAIEMENT
// ============================================================
export const INVOICE_PAYMENT_STATUSES = ["unpaid", "partial", "paid"] as const;

export type InvoicePaymentStatus = (typeof INVOICE_PAYMENT_STATUSES)[number];

// ============================================================
// 2. MÉTHODES DE PAIEMENT
// ============================================================
export const PAYMENT_METHODS = [
  "CASH",
  "MOBILE_MONEY",
  "BANK_TRANSFER",
  "CHECK",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// ============================================================
// 3. SCHÉMA DES FILTRES (pagination, recherche, tri)
// ============================================================
export const invoicesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(INVOICE_PAYMENT_STATUSES).optional(),
  clientId: z.string().uuid().optional(),
  isDelivered: z.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "number", "total", "clientId"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================
// 4. SCHÉMA POUR AJOUTER UN PAIEMENT
// ============================================================
export const addPaymentSchema = z.object({
  amount: z.number().int().positive("Le montant doit être supérieur à 0"),
  method: z.enum(PAYMENT_METHODS),
  reference: z.string().trim().optional().nullable(),
});

// ============================================================
// 5. SCHÉMA POUR MODIFIER UN PAIEMENT
// ============================================================
export const updatePaymentSchema = z.object({
  amount: z
    .number()
    .int()
    .positive("Le montant doit être supérieur à 0")
    .optional(),
  method: z.enum(PAYMENT_METHODS).optional(),
  reference: z.string().trim().optional().nullable(),
});

// ============================================================
// 6. SCHÉMA POUR MARQUER COMME LIVRÉE
// ============================================================
export const markInvoiceDeliveredSchema = z.object({
  isDelivered: z.boolean().default(true),
});

// ============================================================
// 7. SCHÉMA POUR LA MISE À JOUR D'UNE FACTURE
// ============================================================
export const updateInvoiceSchema = z.object({
  deposit: z.number().int().nonnegative().optional(),
  deliveryPlace: z.string().trim().optional().nullable(),
  expectedDeliveryDate: z.coerce.date().optional().nullable(),
});

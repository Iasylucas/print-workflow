import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

export const updateInvoiceSchema = z.object({
  deposit: z.number().int().nonnegative().optional(),
  deliveryPlace: z.string().trim().optional().nullable(),
  expectedDeliveryDate: z.coerce.date().optional().nullable(),
});

export const markInvoiceDeliveredSchema = z.object({
  isDelivered: z.boolean().default(true),
});

export const addPaymentSchema = z.object({
  amount: z.number().int().positive("Le montant doit être supérieur à 0"),
  method: z.enum(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CHECK"]),
  reference: z.string().trim().optional().nullable(),
});

export const updatePaymentSchema = z.object({
  amount: z
    .number()
    .int()
    .positive("Le montant doit être supérieur à 0")
    .optional(),
  method: z.enum(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CHECK"]).optional(),
  reference: z.string().trim().optional().nullable(),
});

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

export const invoiceIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de la facture est invalide"),
});

export const paymentIdParamSchema = z.object({
  paymentId: z.coerce.number().int().positive("L'ID du paiement est invalide"),
});

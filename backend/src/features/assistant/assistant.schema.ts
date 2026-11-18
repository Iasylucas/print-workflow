import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

// ============================================================
// SCHÉMAS DE QUERY POUR CHAQUE RESOURCE
// ============================================================

// --- Invoices ---
export const invoiceListQuerySchema = paginationSchema.extend({
  status: z.enum(["unpaid", "partial", "paid"]).optional(),
  isDelivered: z.boolean().optional(),
  clientId: z.string().optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "number", "total", "clientId"])
    .default("createdAt"),
});

export const invoiceIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de la facture est invalide"),
});

// --- Quotes ---
export const quoteListQuerySchema = paginationSchema.extend({
  status: z.enum(["pending", "converted"]).optional(),
  clientId: z.string().optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "number", "total", "clientId", "status"])
    .default("createdAt"),
});

export const quoteIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID du devis est invalide"),
});

// --- Orders ---
export const orderListQuerySchema = paginationSchema.extend({
  status: z
    .enum([
      "waiting_for_file",
      "in_progress",
      "file_completed",
      "printing_in_progress",
      "cutting_in_progress",
      "ready_for_delivery",
      "delivered",
    ])
    .optional(),
  clientId: z.string().optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "status", "designation", "clientId"])
    .default("createdAt"),
});

export const orderIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de la commande est invalide"),
});

// --- Clients ---
export const clientListQuerySchema = paginationSchema.extend({
  email: z.email().optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "lastName", "firstName"]).default("createdAt"),
});

export const clientIdParamSchema = z.object({
  id: z.string(),
});

// --- Products ---
export const productListQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "slug"]).default("createdAt"),
});

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID du produit est invalide"),
});

export const productSlugParamSchema = z.object({
  slug: z.string(),
});

// --- CompanyInfo ---
export const companyInfoListQuerySchema = paginationSchema.extend({
  sortBy: z.enum(["createdAt"]).default("createdAt"),
});

export const companyInfoIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de l'infos company est invalide"),
});

// --- OrderStatusHistory ---
export const orderStatusHistoryListQuerySchema = paginationSchema.extend({
  orderId: z.string().optional(),
  changedById: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

export const orderStatusHistoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de l'historique est invalide"),
});

// --- PaymentAuditLog ---
export const paymentAuditLogListQuerySchema = paginationSchema.extend({
  invoiceNumber: z.string().optional(),
  action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
  userId: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  sortBy: z.enum(["createdAt"]).default("createdAt"),
});

export const paymentAuditLogIdParamSchema = z.object({
  id: z.string(),
});

// --- Users (safe, no password) ---
export const userListQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  role: z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]).optional(),
  sortBy: z
    .enum(["createdAt", "email", "firstName", "lastName", "role"])
    .default("createdAt"),
});

export const userIdParamSchema = z.object({
  id: z.string(),
});

export const userEmailParamSchema = z.object({
  email: z.string().email(),
});

// Assistant query (main)
export const assistantQuerySchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "La question ne peut pas être vide")
    .max(500, "La question est trop longue (max 500 caractères)"),
});

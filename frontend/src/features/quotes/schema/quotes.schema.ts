// frontend/src/features/quotes/schema/quotes.schema.ts
import { z } from "zod";

// ============================================================
// 1. STATUTS DE DEVIS
// ============================================================
export const QUOTE_STATUSES = ["pending", "converted"] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

// ============================================================
// 2. SCHÉMA DES FILTRES (pagination, recherche, tri)
// ============================================================
export const quotesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(QUOTE_STATUSES).optional(),
  clientId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "number", "total", "clientId", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================
// 3. SCHÉMA POUR LA MISE À JOUR D'UN DEVIS
// ============================================================
export const updateQuoteSchema = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
});

// ============================================================
// 4. SCHÉMA POUR LA CONVERSION DEVIS → FACTURE
// ============================================================
export const convertQuoteSchema = z.object({
  // Pas de données spécifiques pour l'instant
  // On pourrait ajouter des options plus tard
});

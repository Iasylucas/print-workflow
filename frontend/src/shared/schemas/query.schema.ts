import { z } from "zod";

// Schéma de base pour la pagination + tri + filtres date
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

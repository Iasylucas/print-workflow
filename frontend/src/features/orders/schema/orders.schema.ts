import { z } from "zod";

export const ORDER_STATUSES = [
  "waiting_for_file",
  "in_progress",
  "file_completed",
  "printing_in_progress",
  "cutting_in_progress",
  "ready_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  waiting_for_file: "En attente fichier",
  in_progress: "En cours",
  file_completed: "Fichier complet",
  printing_in_progress: "Impression en cours",
  cutting_in_progress: "Découpe en cours",
  ready_for_delivery: "Prêt pour livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ordersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(ORDER_STATUSES).optional(),
  clientId: z.string().uuid().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "status", "designation", "clientId"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const addOrderNoteSchema = z.object({
  text: z.string().trim().min(1, "La note ne peut pas être vide"),
});

export const addOrderFileSchema = z.object({
  url: z.string().url("L'URL du fichier est invalide"),
  category: z.enum(["client_visual", "final_print"]),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

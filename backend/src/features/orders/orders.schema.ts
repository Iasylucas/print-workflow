import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "waiting_for_file",
    "in_progress",
    "file_completed",
    "printing_in_progress",
    "cutting_in_progress",
    "ready_for_delivery",
    "delivered",
    "cancelled",
  ]),
});

export const addOrderNoteSchema = z.object({
  text: z.string().trim().min(1, "La note ne peut pas être vide"),
});

export const addOrderFileSchema = z.object({
  url: z.string().url("L'URL du fichier est invalide"),
  category: z.enum(["client_visual", "final_print"]),
});

export const ordersQuerySchema = paginationSchema.extend({
  status: z
    .enum([
      "waiting_for_file",
      "in_progress",
      "file_completed",
      "printing_in_progress",
      "cutting_in_progress",
      "ready_for_delivery",
      "delivered",
      "cancelled",
    ])
    .optional(),
  clientId: z.string().optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "status", "designation", "clientId"])
    .default("createdAt"),
});

export const updateOrderSchema = z.object({
  designation: z.string().trim().min(1).optional(),
  label: z.string().trim().optional().nullable(),
  dimensions: z.string().trim().optional().nullable(),
  quantity: z.number().int().positive().optional(),
  unitPrice: z.number().int().nonnegative().optional(),
  status: z
    .enum([
      "waiting_for_file",
      "in_progress",
      "file_completed",
      "printing_in_progress",
      "cutting_in_progress",
      "ready_for_delivery",
      "delivered",
      "cancelled",
    ])
    .optional(),
});

export const orderIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de la commande est invalide"),
});

import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

export const notificationsQuerySchema = paginationSchema.extend({
  unreadOnly: z
    .union([
      z.boolean(),
      z.enum(["true", "false"]).transform((val) => val === "true"),
    ])
    .optional(),
});

export const notificationIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de la notification est invalide"),
});
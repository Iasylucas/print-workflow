import { z } from "zod";

export const idParamSchema = z.object({
  id: z.uuid("Invalid ID format"),
});

export const uuidSchema = z.uuid("Invalid UUID format");

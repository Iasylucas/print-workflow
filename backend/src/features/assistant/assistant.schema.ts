import { z } from "zod";

export const assistantQuerySchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "La question ne peut pas être vide")
    .max(500, "La question est trop longue (max 500 caractères)"),
});

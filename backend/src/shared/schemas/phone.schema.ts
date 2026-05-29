import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .min(10, "Phone number must be at least 10 characters long")
  .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format");

export const mobileMoneyNumberSchema = z.object({
  numero: phoneSchema,
  nom: z.string().optional(),
});

export const phoneOptionalSchema = phoneSchema.nullable().optional();

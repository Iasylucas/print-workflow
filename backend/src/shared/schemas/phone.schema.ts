import { z } from "zod";

export const phoneSchema = z
  .string()
  .optional()
  .nullable()
  .transform((val) => (val === "" ? undefined : val))
  .refine(
    (val) => val === undefined || val === null || /^[0-9+\s]+$/.test(val),
    { message: "Invalid phone number format" },
  )
  .refine((val) => val === undefined || val === null || val.length >= 10, {
    message: "Phone number must be at least 10 characters long",
  });
export const mobileMoneyNumberSchema = z.object({
  numero: phoneSchema,
  nom: z.string().optional(),
});

export const phoneOptionalSchema = phoneSchema.nullable().optional();

import { z } from "zod";

export const emailRequiredSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email address"));

export const emailOptionalSchema = emailRequiredSchema.nullable().optional();

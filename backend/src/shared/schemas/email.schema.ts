import { z } from "zod";

export const emailRequiredSchema = z
  .email()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email address"));

export const emailOptionalSchema = emailRequiredSchema.nullable().optional();

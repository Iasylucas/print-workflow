import { z } from "zod";

export const UserRole = z.enum([
  "ADMIN",
  "SALES",
  "PRINTER",
  "GRAPHIC_DESIGNER",
  "DELIVERER",
]);

export type UserRole = z.infer<typeof UserRole>;

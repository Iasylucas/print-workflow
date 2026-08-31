import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import {
  firstNameSchema,
  lastNameSchema,
  emailOptionalSchema,
  phoneOptionalSchema,
  paginationSchema,
} from "@/shared/schemas/index.js";

export const createClientSchema = z.object({
  id: z.uuid().default(() => uuidv7()),
  firstName: firstNameSchema,
  lastName: z.string().trim().optional().nullable(),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.email("Email invalide").optional().nullable(),
  ),
  phone: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
});

export const updateClientSchema = createClientSchema
  .partial()
  .omit({ id: true });

export const clientQuerySchema = paginationSchema.extend({
  email: emailOptionalSchema,
  id: z.uuid().optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "lastName", "firstName"]).default("createdAt"),
});

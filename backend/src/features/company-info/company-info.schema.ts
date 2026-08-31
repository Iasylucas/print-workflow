import { z } from "zod";
import {
  mobileMoneyNumberSchema,
  paginationSchema,
} from "@/shared/schemas/index.js";

export const companyInfoSchema = z.object({
  nif: z.string().min(1),
  stat: z.string().min(1),
  rif: z.string().optional(),
  mainAddress: z.string().min(1),
  mainAddressDetail: z.string().optional(),
  secondaryAddress: z.string().optional(),
  secondaryAddressDetail: z.string().optional(),
  logo: z.url().optional(),
  name: z.string().min(1),
  stamp: z.url().optional(),
  mobileMoneyNumbers: z.array(mobileMoneyNumberSchema).optional(),
  standardPhone: z.string().optional(),
  contactEmail: z.email().optional(),
  termsAndConditions: z.string().optional(),
  deliveryLeadTime: z.string().optional(),
  bankAccountHolder: z.string().optional(),
  bankBranch: z.string().optional(),
  bankCode: z.string().optional(),
  ribInfo: z.string().optional(),
});

export const companyInfoQuerySchema = paginationSchema.extend({
  sortBy: z.enum(["createdAt"]).default("createdAt"),
});

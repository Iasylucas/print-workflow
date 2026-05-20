import { z } from "zod";
import { mobileMoneyNumberSchema } from "@/shared/schemas/phone.schema.js";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

// Schéma de création d'une version CompanyInfo
export const companyInfoSchema = z.object({
  nif: z.string().min(1),
  stat: z.string().min(1),
  rif: z.string().optional(),
  mainAddress: z.string().min(1),
  mainAddressDetail: z.string().optional(),
  secondaryAddress: z.string().optional(),
  secondaryAddressDetail: z.string().optional(),
  logo: z.url().optional(),
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

// Schéma pour la requête d’historique (pagination, tri, filtres)
export const companyInfoQuerySchema = paginationSchema.extend({
  sortBy: z.enum(["createdAt"]).default("createdAt"),
});

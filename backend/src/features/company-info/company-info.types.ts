import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import {
  companyInfoSchema,
  companyInfoQuerySchema,
} from "./company-info.schema.js";

// Selecteur Prisma (tous les champs)
export const companyInfoSelect = {
  id: true,
  nif: true,
  stat: true,
  rif: true,
  mainAddress: true,
  mainAddressDetail: true,
  secondaryAddress: true,
  secondaryAddressDetail: true,
  logo: true,
  stamp: true,
  mobileMoneyNumbers: true,
  standardPhone: true,
  contactEmail: true,
  termsAndConditions: true,
  deliveryLeadTime: true,
  bankAccountHolder: true,
  bankBranch: true,
  bankCode: true,
  ribInfo: true,
  createdAt: true,
} satisfies Prisma.CompanyInfoSelect;

export type CompanyInfoSafe = Prisma.CompanyInfoGetPayload<{
  select: typeof companyInfoSelect;
}>;

export type CreateCompanyInfoInput = z.infer<typeof companyInfoSchema>;
export type CompanyInfoQuery = z.infer<typeof companyInfoQuerySchema>;

export type PaginatedCompanyInfoList = {
  data: CompanyInfoSafe[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

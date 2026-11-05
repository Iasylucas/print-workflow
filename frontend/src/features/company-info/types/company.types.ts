import type z from "zod";
import type {
  companyInfoQuerySchema,
  companyInfoSchema,
  mobileMoneyNumberSchema,
} from "../schema/company-info.schema";

export type CompanyInfo = {
  id: number;
  nif: string;
  stat: string;
  rif: string | null;
  mainAddress: string;
  mainAddressDetail: string | null;
  secondaryAddress: string | null;
  secondaryAddressDetail: string | null;
  logo: string | null;
  name: string;
  stamp: string | null;
  mobileMoneyNumbers: Array<{ numero: string; nom?: string }> | null;
  standardPhone: string | null;
  contactEmail: string | null;
  termsAndConditions: string | null;
  deliveryLeadTime: string | null;
  bankAccountHolder: string | null;
  bankBranch: string | null;
  bankCode: string | null;
  ribInfo: string | null;
  createdAt: string;
};

export type PaginatedCompanyInfoResponse = {
  data: CompanyInfo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

// ============================================================
// 4. TYPES INFÉRÉS
// ============================================================
export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
export type CompanyInfoQueryParams = z.infer<typeof companyInfoQuerySchema>;
export type MobileMoneyNumber = z.infer<typeof mobileMoneyNumberSchema>;

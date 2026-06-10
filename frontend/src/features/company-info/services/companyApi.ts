import { api } from "@/lib/axios";
import type { CompanyInfo } from "../types/company.types";

export const companyApi = {
  getActive: () =>
    api
      .get<{ success: boolean; data: CompanyInfo }>("/company-info")
      .then((res) => res.data.data),
};

import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types";
import type {
  CompanyInfo,
  PaginatedCompanyInfoResponse,
  CompanyInfoQueryParams,
  CompanyInfoFormData,
} from "../types/company.types";

export const companyApi = {
  getActive: () =>
    api.get<ApiResponse<CompanyInfo>>("/company-info").then(unwrap),

  getVersions: (params?: CompanyInfoQueryParams) =>
    api
      .get<ApiResponse<PaginatedCompanyInfoResponse>>(
        "/company-info/versions",
        {
          params,
        },
      )
      .then(unwrap),

  getVersionById: (id: number) =>
    api
      .get<ApiResponse<CompanyInfo>>(`/company-info/versions/${id}`)
      .then(unwrap),

  createVersion: (data: CompanyInfoFormData) =>
    api.post<ApiResponse<CompanyInfo>>("/company-info", data).then(unwrap),
};

import { NotFoundError, InternalServerError } from "@/shared/error/error.js";
import { CompanyInfoRepository } from "./company-info.repository.js";
import {
  CreateCompanyInfoInput,
  CompanyInfoQuery,
  PaginatedCompanyInfoList,
  CompanyInfoSafe,
} from "./company-info.types.js";
import { COMPANY_INFO_ERRORS } from "./company-info.constants.js";

export class CompanyInfoService {
  constructor(private readonly companyInfoRepository: CompanyInfoRepository) {}

  async getActive(): Promise<CompanyInfoSafe> {
    const active = await this.companyInfoRepository.findActive();
    if (!active) {
      throw new NotFoundError(COMPANY_INFO_ERRORS.NOT_FOUND);
    }
    return active;
  }

  async getVersionById(id: number): Promise<CompanyInfoSafe> {
    const version = await this.companyInfoRepository.findById(id);
    if (!version) {
      throw new NotFoundError(COMPANY_INFO_ERRORS.NOT_FOUND_ID(id));
    }
    return version;
  }

  async getAllVersions(
    query: CompanyInfoQuery,
  ): Promise<PaginatedCompanyInfoList> {
    return await this.companyInfoRepository.findAllVersions(query);
  }

  async createNewVersion(
    data: CreateCompanyInfoInput,
  ): Promise<CompanyInfoSafe> {
    try {
      const newVersion = await this.companyInfoRepository.create(data);
      return newVersion;
    } catch (error) {
      throw new InternalServerError(COMPANY_INFO_ERRORS.FAILED_CREATION);
    }
  }
}

export const companyInfoService = new CompanyInfoService(
  new CompanyInfoRepository(),
);

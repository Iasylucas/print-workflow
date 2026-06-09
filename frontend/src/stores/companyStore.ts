import { create } from "zustand";
import { companyApi } from "@/features/company-info/services/companyApi";
import type { CompanyInfo } from "@/features/company-info/types/company.types";

interface CompanyState {
  company: CompanyInfo | null;
  isLoading: boolean;
  fetchCompany: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  isLoading: true,
  fetchCompany: async () => {
    try {
      const company = await companyApi.getActive();
      set({ company, isLoading: false });
    } catch (error) {
      console.error("Failed to load company info", error);
      set({ isLoading: false });
    }
  },
}));

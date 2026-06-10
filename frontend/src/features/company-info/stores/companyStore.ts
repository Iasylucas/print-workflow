import { create } from "zustand";
import { companyApi } from "@/features/company-info/services/companyApi";
import type { CompanyInfo } from "@/features/company-info/types/company.types";
import { withMinimumDelay } from "@/lib/utils";

interface CompanyState {
  company: CompanyInfo | null;
  isLoading: boolean;
  hasFetched: boolean;
  fetchCompany: (force?: boolean) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  isLoading: true,
  hasFetched: false,

  fetchCompany: async (force = false) => {
    if (get().hasFetched && !force && get().company) {
      return;
    }

    set({ isLoading: true });
    try {
      const company = await withMinimumDelay(companyApi.getActive(), 400);
      set({ company, isLoading: false, hasFetched: true });
    } catch (error) {
      console.error("Failed to load company info", error);
      set({ isLoading: false, hasFetched: false });
    }
  },
}));

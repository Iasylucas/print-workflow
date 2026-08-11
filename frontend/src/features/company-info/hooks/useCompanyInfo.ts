// frontend/src/features/company-info/hooks/useCompanyInfo.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyApi } from "../services/companyApi";
import type {
  CompanyInfoQueryParams,
  CompanyInfoFormData,
} from "../types/company.types";

const COMPANY_INFO_QUERY_KEY = "company-info";

// ============================================================
// HOOK POUR LA VERSION ACTIVE
// ============================================================
export const useCompanyInfo = () => {
  return useQuery({
    queryKey: [COMPANY_INFO_QUERY_KEY, "active"],
    queryFn: () => companyApi.getActive(),
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================================
// HOOK POUR L'HISTORIQUE
// ============================================================
export const useCompanyInfoHistory = (params: CompanyInfoQueryParams) => {
  return useQuery({
    queryKey: [COMPANY_INFO_QUERY_KEY, "history", params],
    queryFn: () => companyApi.getVersions(params),
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// HOOK POUR LE DÉTAIL D'UNE VERSION
// ============================================================
export const useCompanyInfoVersion = (id: number | null) => {
  return useQuery({
    queryKey: [COMPANY_INFO_QUERY_KEY, "version", id],
    queryFn: () => companyApi.getVersionById(id!),
    enabled: !!id,
    staleTime: 0,
  });
};

// ============================================================
// HOOK POUR LES MUTATIONS
// ============================================================
export const useCompanyInfoMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCompanyInfo = () => {
    queryClient.invalidateQueries({ queryKey: [COMPANY_INFO_QUERY_KEY] });
  };

  const createVersionMutation = useMutation({
    mutationFn: (data: CompanyInfoFormData) => companyApi.createVersion(data),
    onSuccess: () => {
      toast.success("Informations enregistrées avec succès");
      invalidateCompanyInfo();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });

  return { createVersionMutation };
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompanyInfoForm } from "../components/CompanyInfoForm";
import { CompanyInfoHistory } from "../components/CompanyInfoHistory";
import { CompanyInfoDetailModal } from "../components/CompanyInfoDetailModal";
import {
  useCompanyInfo,
  useCompanyInfoHistory,
  useCompanyInfoMutations,
  useCompanyInfoVersion,
} from "../hooks/useCompanyInfo";
import type { CompanyInfo, CompanyInfoFormData } from "../types/company.types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_QUERY_PARAMS = {
  page: 1,
  limit: 10,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
};

export const CompanySettingsPage = () => {
  const { user } = useAuth();

  const [queryParams, setQueryParams] = useState(DEFAULT_QUERY_PARAMS);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null,
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["orders", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["invoices", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["quotes", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["payment-audit-logs"] });
  };

  const { data: active, isLoading: isLoadingActive } = useCompanyInfo();
  const { data: history, isLoading: isLoadingHistory } =
    useCompanyInfoHistory(queryParams);
  const { data: versionDetail, isLoading: isLoadingVersion } =
    useCompanyInfoVersion(selectedVersionId);
  const { createVersionMutation } = useCompanyInfoMutations();

  const handleSubmit = (data: CompanyInfoFormData) => {
    createVersionMutation.mutate(data);
  };

  const goToPage = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleViewVersion = (version: CompanyInfo) => {
    setSelectedVersionId(version.id);
    setDetailModalOpen(true);
  };

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Paramètres de l'entreprise"
        subtitle="Gérez les informations de votre entreprise et suivez l'historique des modifications"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchi
        </Button>
      </PageHeader>

      <div className="w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyInfoForm
              active={active}
              isLoading={isLoadingActive}
              isUpdating={createVersionMutation.isPending}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique des modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyInfoHistory
              data={history}
              isLoading={isLoadingHistory}
              currentPage={queryParams.page}
              totalPages={history?.meta?.totalPages || 1}
              limit={queryParams.limit}
              goToPage={goToPage}
              onRowClick={handleViewVersion}
            />
          </CardContent>
        </Card>

        <CompanyInfoDetailModal
          isOpen={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          version={versionDetail || null}
          isLoading={isLoadingVersion}
        />
      </div>
    </div>
  );
};

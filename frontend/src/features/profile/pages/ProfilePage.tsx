// frontend/src/features/profile/pages/ProfilePage.tsx
import { PageHeader } from "@/components/shared/PageHeader";
import { useProfile, useProfileMutations } from "../hooks/useProfile";
import { ProfileForm } from "../components/ProfileForm";
import type { UpdateProfileRequest } from "../types/profile.types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const ProfilePage = () => {
  const { data: profile, isLoading } = useProfile();
  const { updateProfileMutation } = useProfileMutations();

  const handleSubmit = (data: UpdateProfileRequest) => {
    updateProfileMutation.mutate(data);
  };

  const queryClient = useQueryClient();
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["orders", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["invoices", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["quotes", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["payment-audit-logs"] });
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Mon profil"
        subtitle="Gérez vos informations personnelles"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      </PageHeader>
      <div className="max-w-2xl">
        <ProfileForm
          profile={profile}
          isLoading={isLoading}
          isUpdating={updateProfileMutation.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

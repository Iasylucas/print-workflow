// frontend/src/features/profile/pages/ProfilePage.tsx
import { PageHeader } from "@/components/shared/PageHeader";
import { useProfile, useProfileMutations } from "../hooks/useProfile";
import { ProfileForm } from "../components/ProfileForm";
import type { UpdateProfileRequest } from "../types/profile.types";

export const ProfilePage = () => {
  const { data: profile, isLoading } = useProfile();
  const { updateProfileMutation } = useProfileMutations();

  const handleSubmit = (data: UpdateProfileRequest) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Mon profil"
        subtitle="Gérez vos informations personnelles"
      />

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

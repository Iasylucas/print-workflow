// frontend/src/features/profile/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileApi } from "../services/profileApi";
import type { UpdateProfileRequest } from "../types/profile.types";

const PROFILE_QUERY_KEY = "profile";

export const useProfile = () => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: () => profileApi.getMyProfile(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      profileApi.updateMyProfile(data),
    onSuccess: () => {
      toast.success("Profil mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la mise à jour du profil");
    },
  });

  return { updateProfileMutation };
};

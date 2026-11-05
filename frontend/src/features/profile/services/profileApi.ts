// frontend/src/features/profile/services/profileApi.ts
import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types";
import type { UserProfile, UpdateProfileRequest } from "../types/profile.types";

export const profileApi = {
  // Récupérer le profil
  getMyProfile: () =>
    api.get<ApiResponse<UserProfile>>("/users/me").then(unwrap),

  // Mettre à jour le profil
  updateMyProfile: (data: UpdateProfileRequest) =>
    api.patch<ApiResponse<UserProfile>>("/users/me", data).then(unwrap),
};

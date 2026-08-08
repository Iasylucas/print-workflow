// frontend/src/features/profile/types/profile.types.ts
export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UpdateProfileRequest = {
  firstName?: string | null;
  lastName?: string;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
};

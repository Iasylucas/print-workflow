import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/features/auth/services/authApi";
import type {
  User,
  LoginRequest,
  FinalizeRegistrationRequest,
} from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: FinalizeRegistrationRequest) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (data) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authApi.login(data);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authApi.finalize(data);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      setAuth: (user, token) => {
        set({ user, token });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

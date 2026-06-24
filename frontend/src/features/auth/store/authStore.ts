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
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: FinalizeRegistrationRequest) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Reste à true pendant la lecture initiale du localStorage

      login: async (data: LoginRequest) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authApi.login(data);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      register: async (data: FinalizeRegistrationRequest) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authApi.finalize(data);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      clearError: () => {
        // Réservé pour un éventuel champ error, pas utilisé ici
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => {
        return (state, error) => {
          if (state) {
            state.isLoading = false;
          }
          if (error) {
            console.error("Erreur de réhydratation du store auth:", error);
          }
        };
      },
    },
  ),
);

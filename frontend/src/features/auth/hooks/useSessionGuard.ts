import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/services/authApi";
import { useAuth } from "./useAuth";

export const useSessionGuard = () => {
  const { isAuthenticated, token, setAuth } = useAuth();

  return useQuery({
    queryKey: ["session-verification"],
    queryFn: async () => {
      const { user } = await authApi.getMe();

      setAuth(user, token!);

      return user;
    },
    enabled: isAuthenticated && !!token,

    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
    staleTime: 1000 * 60 * 4.5,
    retry: false,
  });
};

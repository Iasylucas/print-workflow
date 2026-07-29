// src/features/client/hooks/useClients.ts
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../services/clientApi";

export const useClients = (search?: string) => {
  return useQuery({
    queryKey: ["clients-list", search],
    queryFn: () => clientApi.getClients({ search }),
    staleTime: 1000 * 60 * 5,
  });
};

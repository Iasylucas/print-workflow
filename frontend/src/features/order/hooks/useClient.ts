// src/features/client/hooks/useClients.ts
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../services/clientApi";

export const useClients = () => {
  return useQuery({
    queryKey: ["clients-list"],
    queryFn: () => clientApi.getClients(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

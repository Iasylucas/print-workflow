import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../services/clientApi";
import type {
  ClientsQueryParams,
  CreateClientRequest,
  UpdateClientRequest,
} from "../types/client.types";
import { toast } from "sonner";

const CLIENTS_QUERY_KEY = "clients";

export const useClients = (params?: ClientsQueryParams) => {
  return useQuery({
    queryKey: [CLIENTS_QUERY_KEY, params],
    queryFn: () => clientApi.getClients(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useClientMutations = () => {
  const queryClient = useQueryClient();

  const invalidateClients = () => {
    queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateClientRequest) => clientApi.createClient(data),
    onSuccess: () => {
      toast.success("Client créé avec succès");
      invalidateClients();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      clientApi.updateClient(id, data),
    onSuccess: () => {
      toast.success("Client modifié avec succès");
      invalidateClients();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la modification");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientApi.deleteClient(id),
    onSuccess: () => {
      toast.success("Client supprimé avec succès");
      invalidateClients();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

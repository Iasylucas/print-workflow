import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userApi";
import type {
  UsersQueryParams,
  EditUserRequest,
  InviteUserRequest,
  InvitationsQueryParams,
} from "../types/user.types";
import { toast } from "sonner";

const USERS_QUERY_KEY = "users";
const INVITATIONS_QUERY_KEY = "invitations";

export const useUsers = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: () => userApi.getUsers(params),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [INVITATIONS_QUERY_KEY] });
  };

  const invalidateInvitations = () => {
    queryClient.invalidateQueries({ queryKey: [INVITATIONS_QUERY_KEY] });
  };

  const inviteMutation = useMutation({
    mutationFn: (data: InviteUserRequest) => userApi.inviteUser(data),
    onSuccess: () => {
      toast.success("Invitation envoyée avec succès");
      invalidateInvitations();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de l'envoi");
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteInvitation(id),
    onSuccess: () => {
      toast.success("Invitation annulée avec succès");
      invalidateInvitations(); // Totalement étanche, ne touche pas aux utilisateurs
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de l'annulation");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      toast.success("Utilisateur Modifié avec succès");
      invalidateUsers();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la modication");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      invalidateUsers();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression");
    },
  });

  return {
    inviteMutation,
    updateMutation,
    deleteMutation,
    cancelInvitationMutation,
  };
};

export const useInvitations = (params: InvitationsQueryParams) => {
  return useQuery({
    queryKey: [INVITATIONS_QUERY_KEY, params],
    queryFn: () => userApi.getInvitations(params),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userApi";
import type {
  UsersQueryParams,
  EditUserRequest,
  InviteUserRequest,
} from "../types/user.types";
import { toast } from "sonner";

const USERS_QUERY_KEY = "users";

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
  };

  const inviteMutation = useMutation({
    mutationFn: (data: InviteUserRequest) => userApi.inviteUser(data),
    onSuccess: invalidateUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: invalidateUsers,
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

  return { inviteMutation, updateMutation, deleteMutation };
};

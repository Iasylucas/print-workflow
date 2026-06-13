import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse, SimpleApiResponse } from "@/shared/types/";
import type {
  User,
  UsersQueryParams,
  PaginatedUsersResponse,
  InviteUserRequest,
  EditUserRequest,
  UpdateProfileRequest,
} from "../types/user.types";

export const userApi = {
  getUsers: (params?: UsersQueryParams) =>
    api
      .get<ApiResponse<PaginatedUsersResponse>>("/users", { params })
      .then(unwrap),

  getUserById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`).then(unwrap),

  updateUser: (id: string, data: EditUserRequest) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data).then(unwrap),

  deleteUser: (id: string) =>
    api.delete<SimpleApiResponse>(`/users/${id}`).then((res) => res.data),

  inviteUser: (data: InviteUserRequest) =>
    api.post<SimpleApiResponse>("/auth/invite", data).then((res) => res.data),

  getMyProfile: () => api.get<ApiResponse<User>>("/me").then(unwrap),

  updateMyProfile: (data: UpdateProfileRequest) =>
    api.patch<ApiResponse<User>>("/me", data).then(unwrap),
};

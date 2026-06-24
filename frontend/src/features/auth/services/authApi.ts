import { api } from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  InviteUserRequest,
  FinalizeRegistrationRequest,
  FinalizeRegistrationResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ConfirmEmailChangeRequest,
} from "../types/auth.types";

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data).then((res) => res.data.data),

  invite: (data: InviteUserRequest) =>
    api.post<void>("/auth/invite", data).then((res) => res.data),

  finalize: (data: FinalizeRegistrationRequest) =>
    api
      .post<FinalizeRegistrationResponse>("/auth/finalize", data)
      .then((res) => res.data.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<void>("/auth/change-password", data).then((res) => res.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<void>("/auth/forgot-password", data).then((res) => res.data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<void>("/auth/reset-password", data).then((res) => res.data),

  confirmEmailChange: (data: ConfirmEmailChangeRequest) =>
    api.post<void>("/auth/confirm-email-change", data).then((res) => res.data),

  getMe: () => api.get<LoginResponse>("/auth/me").then((res) => res.data.data),
};

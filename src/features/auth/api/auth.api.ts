import { apiClient } from "../../../shared/api/apiClient";
import type {
  ChangePasswordRequest,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types/auth.types";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", request);
  return response.data;
}

export async function refreshToken(
  request: RefreshTokenRequest,
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/api/v1/auth/refresh",
    request,
  );
  return response.data;
}

export async function logout(request?: LogoutRequest): Promise<void> {
  await apiClient.post("/api/v1/auth/logout", request ?? {});
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await apiClient.get<CurrentUserResponse>("/api/v1/auth/me");
  return response.data;
}

export async function changePassword(
  request: ChangePasswordRequest,
): Promise<void> {
  await apiClient.post("/api/v1/auth/change-password", request);
}

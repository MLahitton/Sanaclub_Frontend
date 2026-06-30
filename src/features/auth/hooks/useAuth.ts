import { useCallback } from "react";
import { toast } from "sonner";
import {
  changePassword,
  getCurrentUser,
  login,
  logout as logoutApi,
} from "../api/auth.api";
import type {
  ChangePasswordRequest,
  CurrentUserResponse,
  LoginRequest,
} from "../types/auth.types";
import { useAuthStore } from "../stores/auth.store";

export function useAuth() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const tokens = useAuthStore((state) => state.tokens);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);
  const hasAllPermissions = useAuthStore((state) => state.hasAllPermissions);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasRole = useAuthStore((state) => state.hasRole);

  const loginUser = useCallback(
    async (payload: LoginRequest) => {
      const response = await login(payload);
      let userData = response.user ?? null;

      if (!userData) {
        userData = await getCurrentUser();
      }

      if (!userData) {
        throw new Error("Respuesta incompleta al autenticar.");
      }

      setSession({
        status: "authenticated",
        user: userData,
        tokens: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });

      return userData;
    },
    [setSession],
  );

  const changePasswordWithRefresh = useCallback(
    async (payload: ChangePasswordRequest): Promise<CurrentUserResponse> => {
      await changePassword(payload);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    },
    [setUser],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutApi(tokens?.refreshToken ? { refreshToken: tokens.refreshToken } : undefined);
    } catch {
      // best effort logout request
    } finally {
      clearSession();
      toast.success("Sesion cerrada.");
    }
  }, [clearSession, tokens?.refreshToken]);

  return {
    changePasswordWithRefresh,
    hasAnyPermission,
    hasAllPermissions,
    hasPermission,
    hasRole,
    isAuthenticated,
    loginUser,
    logout,
    setSession,
    setUser,
    status,
    tokens,
    user,
  };
}

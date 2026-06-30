import { create } from "zustand";
import { getCurrentUser } from "../api/auth.api";
import type {
  AuthStatus,
  AuthTokens,
  CurrentUserResponse,
} from "../types/auth.types";
import {
  clearAuthStorage,
  getStoredTokens,
  getStoredUser,
  setStoredTokens,
  setStoredUser,
} from "../utils/authStorage";
import {
  hasAnyPermission,
  hasAllPermissions,
  hasPermission,
  hasRole,
} from "../utils/permissions";

type AuthState = {
  status: AuthStatus;
  user: CurrentUserResponse | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setSession: (data: {
    status: AuthStatus;
    user?: CurrentUserResponse | null;
    tokens?: AuthTokens | null;
  }) => void;
  setUser: (user: CurrentUserResponse | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  clearSession: () => void;
  bootstrapSession: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: getStoredUser(),
  tokens: getStoredTokens(),
  isAuthenticated: false,

  setSession({ status, user = null, tokens = null }) {
    set({
      status,
      user,
      tokens,
      isAuthenticated: status === "authenticated",
    });

    if (status === "authenticated" && user && tokens) {
      setStoredUser(user);
      setStoredTokens(tokens);
    }
  },

  setUser(user) {
    set({ user });
    setStoredUser(user);
  },

  setTokens(tokens) {
    set({ tokens });
    setStoredTokens(tokens);
  },

  clearSession() {
    clearAuthStorage();
    set({
      status: "unauthenticated",
      user: null,
      tokens: null,
      isAuthenticated: false,
    });
  },

  async bootstrapSession() {
    if (get().status === "checking") {
      return;
    }

    const storedTokens = getStoredTokens();

    if (!storedTokens) {
      get().clearSession();
      return;
    }

    set({
      status: "checking",
      tokens: storedTokens,
      user: getStoredUser(),
      isAuthenticated: false,
    });

    try {
      const currentUser = await getCurrentUser();
      set({
        status: "authenticated",
        user: currentUser,
        tokens: storedTokens,
        isAuthenticated: true,
      });
      setStoredUser(currentUser);
      setStoredTokens(storedTokens);
    } catch {
      get().clearSession();
    }
  },

  hasRole(role) {
    return hasRole(get().user, role);
  },

  hasPermission(permission) {
    return hasPermission(get().user, permission);
  },

  hasAnyPermission(permissions) {
    return hasAnyPermission(get().user, permissions);
  },

  hasAllPermissions(permissions) {
    return hasAllPermissions(get().user, permissions);
  },
}));

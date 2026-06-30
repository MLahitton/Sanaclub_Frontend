import type { AuthTokens, CurrentUserResponse } from "../types/auth.types";

const AUTH_TOKEN_STORAGE_KEY = "sanaclub.auth.tokens";
const AUTH_USER_STORAGE_KEY = "sanaclub.auth.user";

export function getStoredTokens(): AuthTokens | null {
  const raw = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    clearStoredTokens();
    return null;
  }
}

export function setStoredTokens(tokens: AuthTokens | null): void {
  if (!tokens) {
    clearStoredTokens();
    return;
  }
  sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getStoredUser(): CurrentUserResponse | null {
  const raw = sessionStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CurrentUserResponse;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function setStoredUser(user: CurrentUserResponse | null): void {
  if (!user) {
    clearStoredUser();
    return;
  }

  sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function clearAuthStorage(): void {
  clearStoredTokens();
  clearStoredUser();
}

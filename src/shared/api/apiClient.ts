import axios, {
  type AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearAuthStorage,
  getStoredTokens,
  setStoredTokens,
} from "../../features/auth/utils/authStorage";
import { toast } from "sonner";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5048";

type RefreshResponseShape = {
  accessToken: string;
  refreshToken: string;
  user?: Record<string, unknown>;
};

type ApiRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type AuthSessionExpiredHandler = () => void;

const noRefreshPaths = [
  "/api/v1/auth/login",
  "/api/v1/auth/refresh",
  "/api/v1/auth/logout",
];

let refreshPromise: Promise<RefreshResponseShape | null> | null = null;
let authSessionExpiredHandler: AuthSessionExpiredHandler | null = null;

export function setAuthSessionExpiredHandler(handler: AuthSessionExpiredHandler | null) {
  authSessionExpiredHandler = handler;
}

function requestNeedsRetry(config: ApiRequestConfig | undefined): boolean {
  if (!config?.url) return false;
  return noRefreshPaths.some((path) => config.url?.includes(path));
}

async function refreshAccessToken(): Promise<RefreshResponseShape | null> {
  if (refreshPromise) return refreshPromise;

  const tokens = getStoredTokens();
  if (!tokens?.refreshToken) {
    return null;
  }

  refreshPromise = axios
    .post<RefreshResponseShape>(
      `${API_BASE_URL}/api/v1/auth/refresh`,
      { refreshToken: tokens.refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )
    .then((response) => response.data)
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function clearSession() {
  clearAuthStorage();
  authSessionExpiredHandler?.();
}

function handleRedirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredTokens()?.accessToken;

    if (token) {
      const headers = new AxiosHeaders(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ApiRequestConfig | undefined;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      requestNeedsRetry(originalRequest)
    ) {
      return Promise.reject(error);
    }

    const existingRefreshToken = getStoredTokens()?.refreshToken;

    if (!existingRefreshToken) {
      clearSession();
      toast.error("La sesion expiró. Inicia sesion nuevamente.");
      handleRedirectToLogin();
      return Promise.reject(error);
    }

    const refreshData = await refreshAccessToken();
    if (!refreshData?.accessToken || !refreshData.refreshToken) {
      clearSession();
      handleRedirectToLogin();
      return Promise.reject(error);
    }

    setStoredTokens({
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
    });

    originalRequest._retry = true;
    const headers = new AxiosHeaders(originalRequest.headers);
    headers.set("Authorization", `Bearer ${refreshData.accessToken}`);
    originalRequest.headers = headers;

    return apiClient(originalRequest);
  },
);

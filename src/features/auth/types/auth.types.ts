export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  accessTokenExpiresAtUtc?: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc?: string;
  user?: CurrentUserResponse;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  accessTokenExpiresAtUtc?: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc?: string;
  user?: CurrentUserResponse;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type CurrentUserResponse = {
  id: string;
  email: string;
  fullName: string;
  mustChangePassword: boolean;
  roles: string[];
  permissions: string[];
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

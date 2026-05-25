import type { User } from "./types";
import type { AuthScope } from "../../lib/auth/tokenStorage";
import {
  ADMIN_AUTH_REFRESH_TOKEN_KEY,
  ADMIN_AUTH_TOKEN_KEY,
  ADMIN_AUTH_USER_KEY,
  USER_AUTH_REFRESH_TOKEN_KEY,
  USER_AUTH_TOKEN_KEY,
  USER_AUTH_USER_KEY,
  getStoredToken,
  migrateLegacyAdminTokens,
} from "../../lib/auth/tokenStorage";

const REFRESH_KEYS: Record<AuthScope, string> = {
  admin: ADMIN_AUTH_REFRESH_TOKEN_KEY,
  user: USER_AUTH_REFRESH_TOKEN_KEY,
};

const USER_KEYS: Record<AuthScope, string> = {
  admin: ADMIN_AUTH_USER_KEY,
  user: USER_AUTH_USER_KEY,
};

export function getStoredRefreshToken(scope: AuthScope): string | null {
  return localStorage.getItem(REFRESH_KEYS[scope]);
}

export function getStoredUser(scope: AuthScope): User | null {
  const raw = localStorage.getItem(USER_KEYS[scope]);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveAuthSession(
  scope: AuthScope,
  token: string,
  refreshToken: string,
  user: User,
): void {
  localStorage.setItem(
    scope === "admin" ? ADMIN_AUTH_TOKEN_KEY : USER_AUTH_TOKEN_KEY,
    token,
  );
  localStorage.setItem(REFRESH_KEYS[scope], refreshToken);
  localStorage.setItem(USER_KEYS[scope], JSON.stringify(user));
}

export function clearAuthSession(scope: AuthScope): void {
  localStorage.removeItem(scope === "admin" ? ADMIN_AUTH_TOKEN_KEY : USER_AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEYS[scope]);
  localStorage.removeItem(USER_KEYS[scope]);
}

export { getStoredToken, migrateLegacyAdminTokens };

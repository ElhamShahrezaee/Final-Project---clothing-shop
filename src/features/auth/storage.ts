import type { User } from "./types";
import type { AuthScope } from "../../lib/auth/tokenStorage";
import {
  clearStoredSession,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUserJson,
  migrateLegacyAdminTokens,
  saveStoredSession,
} from "../../lib/auth/tokenStorage";

export function getStoredUser(scope: AuthScope): User | null {
  const raw = getStoredUserJson(scope);
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
  saveStoredSession(scope, token, refreshToken, JSON.stringify(user));
}

export function clearAuthSession(scope: AuthScope): void {
  clearStoredSession(scope);
}

export { getStoredRefreshToken, getStoredToken, migrateLegacyAdminTokens };

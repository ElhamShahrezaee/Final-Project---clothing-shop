/** @deprecated Use admin keys; kept for one-time migration from older builds */
export const LEGACY_AUTH_TOKEN_KEY = "auth_token";
export const LEGACY_AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";
export const LEGACY_AUTH_USER_KEY = "auth_user";

export const ADMIN_AUTH_TOKEN_KEY = "admin_auth_token";
export const ADMIN_AUTH_REFRESH_TOKEN_KEY = "admin_auth_refresh_token";
export const ADMIN_AUTH_USER_KEY = "admin_auth_user";

export const USER_AUTH_TOKEN_KEY = "user_auth_token";
export const USER_AUTH_REFRESH_TOKEN_KEY = "user_auth_refresh_token";
export const USER_AUTH_USER_KEY = "user_auth_user";

export type AuthScope = "admin" | "user";

const TOKEN_KEYS: Record<AuthScope, string> = {
  admin: ADMIN_AUTH_TOKEN_KEY,
  user: USER_AUTH_TOKEN_KEY,
};

export function getStoredToken(scope: AuthScope): string | null {
  return localStorage.getItem(TOKEN_KEYS[scope]);
}

export function getStoredTokenForRequest(): string | null {
  if (typeof window === "undefined") return null;

  if (window.location.pathname.startsWith("/admin")) {
    return getStoredToken("admin");
  }

  return getStoredToken("user") ?? getStoredToken("admin");
}

export function migrateLegacyAdminTokens(): void {
  if (getStoredToken("admin")) return;

  const legacyToken = localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
  if (!legacyToken) return;

  localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, legacyToken);

  const legacyRefresh = localStorage.getItem(LEGACY_AUTH_REFRESH_TOKEN_KEY);
  if (legacyRefresh) {
    localStorage.setItem(ADMIN_AUTH_REFRESH_TOKEN_KEY, legacyRefresh);
  }

  const legacyUser = localStorage.getItem(LEGACY_AUTH_USER_KEY);
  if (legacyUser) {
    localStorage.setItem(ADMIN_AUTH_USER_KEY, legacyUser);
  }

  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_REFRESH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_USER_KEY);
}

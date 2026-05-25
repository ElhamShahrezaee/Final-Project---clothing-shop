import {
  COOKIE_MAX_AGE,
  getCookie,
  migrateStorageKeyToCookie,
  removeCookie,
  setCookie,
} from "./cookies";

/** @deprecated Migrated to cookies */
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

const REFRESH_KEYS: Record<AuthScope, string> = {
  admin: ADMIN_AUTH_REFRESH_TOKEN_KEY,
  user: USER_AUTH_REFRESH_TOKEN_KEY,
};

const USER_KEYS: Record<AuthScope, string> = {
  admin: ADMIN_AUTH_USER_KEY,
  user: USER_AUTH_USER_KEY,
};

export function setStoredToken(scope: AuthScope, token: string): void {
  setCookie(TOKEN_KEYS[scope], token, COOKIE_MAX_AGE.accessToken);
}

export function getStoredToken(scope: AuthScope): string | null {
  return getCookie(TOKEN_KEYS[scope]);
}

export function removeStoredToken(scope: AuthScope): void {
  removeCookie(TOKEN_KEYS[scope]);
}

export function setStoredRefreshToken(scope: AuthScope, refreshToken: string): void {
  setCookie(REFRESH_KEYS[scope], refreshToken, COOKIE_MAX_AGE.refreshToken);
}

export function getStoredRefreshToken(scope: AuthScope): string | null {
  return getCookie(REFRESH_KEYS[scope]);
}

export function removeStoredRefreshToken(scope: AuthScope): void {
  removeCookie(REFRESH_KEYS[scope]);
}

export function setStoredUserJson(scope: AuthScope, userJson: string): void {
  setCookie(USER_KEYS[scope], userJson, COOKIE_MAX_AGE.user);
}

export function getStoredUserJson(scope: AuthScope): string | null {
  return getCookie(USER_KEYS[scope]);
}

export function removeStoredUserJson(scope: AuthScope): void {
  removeCookie(USER_KEYS[scope]);
}

export function saveStoredSession(
  scope: AuthScope,
  token: string,
  refreshToken: string,
  userJson: string,
): void {
  setStoredToken(scope, token);
  setStoredRefreshToken(scope, refreshToken);
  setStoredUserJson(scope, userJson);
}

export function clearStoredSession(scope: AuthScope): void {
  removeStoredToken(scope);
  removeStoredRefreshToken(scope);
  removeStoredUserJson(scope);
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

  migrateStorageKeyToCookie(LEGACY_AUTH_TOKEN_KEY, COOKIE_MAX_AGE.accessToken);
  migrateStorageKeyToCookie(LEGACY_AUTH_REFRESH_TOKEN_KEY, COOKIE_MAX_AGE.refreshToken);
  migrateStorageKeyToCookie(LEGACY_AUTH_USER_KEY, COOKIE_MAX_AGE.user);

  if (getCookie(LEGACY_AUTH_TOKEN_KEY)) {
    const token = getCookie(LEGACY_AUTH_TOKEN_KEY)!;
    setStoredToken("admin", token);
    removeCookie(LEGACY_AUTH_TOKEN_KEY);
  }

  const legacyRefresh = getCookie(LEGACY_AUTH_REFRESH_TOKEN_KEY);
  if (legacyRefresh) {
    setStoredRefreshToken("admin", legacyRefresh);
    removeCookie(LEGACY_AUTH_REFRESH_TOKEN_KEY);
  }

  const legacyUser = getCookie(LEGACY_AUTH_USER_KEY);
  if (legacyUser) {
    setStoredUserJson("admin", legacyUser);
    removeCookie(LEGACY_AUTH_USER_KEY);
  }

  migrateScopeFromLocalStorage("admin");
  migrateScopeFromLocalStorage("user");
}

function migrateScopeFromLocalStorage(scope: AuthScope): void {
  const tokenKey = TOKEN_KEYS[scope];
  const refreshKey = REFRESH_KEYS[scope];
  const userKey = USER_KEYS[scope];

  if (!getStoredToken(scope)) {
    migrateStorageKeyToCookie(tokenKey, COOKIE_MAX_AGE.accessToken);
  }
  if (!getStoredRefreshToken(scope)) {
    migrateStorageKeyToCookie(refreshKey, COOKIE_MAX_AGE.refreshToken);
  }
  if (!getStoredUserJson(scope)) {
    migrateStorageKeyToCookie(userKey, COOKIE_MAX_AGE.user);
  }
}

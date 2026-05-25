const SEVEN_DAYS_SEC = 60 * 60 * 24 * 7;
const THIRTY_DAYS_SEC = 60 * 60 * 24 * 30;

export const COOKIE_MAX_AGE = {
  accessToken: SEVEN_DAYS_SEC,
  refreshToken: THIRTY_DAYS_SEC,
  user: THIRTY_DAYS_SEC,
} as const;

export function setCookie(
  name: string,
  value: string,
  maxAgeSeconds: number = SEVEN_DAYS_SEC,
): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
  if (!match) return null;

  return decodeURIComponent(match.slice(prefix.length));
}

export function removeCookie(name: string): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${secure}`;
}

/** Moves a value from localStorage into a cookie, then removes the localStorage entry. */
export function migrateStorageKeyToCookie(
  key: string,
  maxAgeSeconds: number = SEVEN_DAYS_SEC,
): void {
  const legacy = localStorage.getItem(key);
  if (!legacy) return;

  setCookie(key, legacy, maxAgeSeconds);
  localStorage.removeItem(key);
}

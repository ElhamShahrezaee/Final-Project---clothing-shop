import type { User } from "./types";
import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
} from "../../lib/auth/tokenStorage";

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveAuthSession(
  token: string,
  refreshToken: string,
  user: User,
): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export { getStoredToken } from "../../lib/auth/tokenStorage";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../../features/auth/api/getMe";
import { loginUser } from "../../features/auth/api/login";
import type { User } from "../../features/auth/types";

function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  saveAuthSession,
} from "../../features/auth/storage";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (!token || !storedUser) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      // Keep the user logged in across refresh using stored session.
      if (!cancelled) setUser(storedUser);

      try {
        const currentUser = await getCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
          const refreshToken = getStoredRefreshToken();
          if (refreshToken) {
            saveAuthSession(token, refreshToken, currentUser);
          }
        }
      } catch (error) {
        // Only logout when the token is invalid/expired — not on network/API outages.
        if (isUnauthorizedError(error)) {
          clearAuthSession();
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser({ email, password });

    if (data.user.role !== "admin") {
      clearAuthSession();
      throw new Error("شما دسترسی ادمین ندارید");
    }

    saveAuthSession(data.token, data.refreshToken, data.user);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user && getStoredToken()),
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../../features/auth/api/getMe";
import { loginUser as loginApi } from "../../features/auth/api/login";
import type { User } from "../../features/auth/types";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  migrateLegacyAdminTokens,
  saveAuthSession,
} from "../../features/auth/storage";
import { AuthContext } from "./AuthContext";

function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

async function restoreScopeSession(
  scope: "admin" | "user",
  setUser: (user: User | null) => void,
): Promise<void> {
  const token = getStoredToken(scope);
  const storedUser = getStoredUser(scope);

  if (!token || !storedUser) return;

  setUser(storedUser);

  try {
    const currentUser = await getCurrentUser(scope);
    setUser(currentUser);
    const refreshToken = getStoredRefreshToken(scope);
    if (refreshToken) {
      saveAuthSession(scope, token, refreshToken, currentUser);
    }
  } catch (error) {
    if (isUnauthorizedError(error)) {
      clearAuthSession(scope);
      setUser(null);
    }
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [storeUser, setStoreUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSessions() {
      migrateLegacyAdminTokens();

      await restoreScopeSession("admin", (user) => {
        if (!cancelled) setAdminUser(user);
      });
      await restoreScopeSession("user", (user) => {
        if (!cancelled) setStoreUser(user);
      });

      if (!cancelled) setIsLoading(false);
    }

    void restoreSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const data = await loginApi({ email, password });

    if (data.user.role !== "admin") {
      throw new Error("شما دسترسی ادمین ندارید");
    }

    saveAuthSession("admin", data.token, data.refreshToken, data.user);
    setAdminUser(data.user);
    return data.user;
  }, []);

  const loginUser = useCallback(async (email: string, password: string) => {
    const data = await loginApi({ email, password });

    if (data.user.role === "admin") {
      saveAuthSession("admin", data.token, data.refreshToken, data.user);
      setAdminUser(data.user);
      return data.user;
    }

    if (data.user.role !== "user") {
      throw new Error("نقش کاربر معتبر نیست");
    }

    saveAuthSession("user", data.token, data.refreshToken, data.user);
    setStoreUser(data.user);
    return data.user;
  }, []);

  const logoutAdmin = useCallback(() => {
    clearAuthSession("admin");
    setAdminUser(null);
  }, []);

  const logoutUser = useCallback(() => {
    clearAuthSession("user");
    setStoreUser(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginAdmin(email, password);
    },
    [loginAdmin],
  );

  const logout = logoutAdmin;

  const value = useMemo(
    () => ({
      adminUser,
      storeUser,
      isLoading,
      isAdminAuthenticated: Boolean(adminUser && getStoredToken("admin")),
      isUserAuthenticated: Boolean(storeUser && getStoredToken("user")),
      user: adminUser,
      isAuthenticated: Boolean(adminUser && getStoredToken("admin")),
      isAdmin: adminUser?.role === "admin",
      loginAdmin,
      loginUser,
      login,
      logoutAdmin,
      logoutUser,
      logout,
    }),
    [
      adminUser,
      storeUser,
      isLoading,
      loginAdmin,
      loginUser,
      login,
      logoutAdmin,
      logoutUser,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

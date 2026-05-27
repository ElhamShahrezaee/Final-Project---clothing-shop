import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useUserAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within AuthProvider");
  }

  return {
    user: context.storeUser,
    isLoading: context.isLoading,
    isAuthenticated: context.isUserAuthenticated,
    login: context.loginUser,
    register: context.registerUser,
    logout: context.logoutUser,
    syncStoreUser: context.syncStoreUser,
  } as const;
}

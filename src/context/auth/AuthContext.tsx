import { createContext } from "react";
import type { RegisterPayload, User } from "../../features/auth/types";

export interface AuthContextValue {
  adminUser: User | null;
  storeUser: User | null;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  isUserAuthenticated: boolean;
  /** @deprecated Admin panel — use adminUser */
  user: User | null;
  /** @deprecated Admin panel */
  isAuthenticated: boolean;
  /** @deprecated Admin panel */
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => Promise<User>;
  loginUser: (email: string, password: string) => Promise<User>;
  registerUser: (payload: RegisterPayload) => Promise<User>;
  /** @deprecated Admin panel */
  login: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
  logoutUser: () => void;
  /** @deprecated Admin panel */
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

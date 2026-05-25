import type { User, UserRole } from "../types";

export type RawAuthUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  phone?: string;
};

export function mapAuthUser(raw: RawAuthUser): User {
  const id = raw.id ?? raw._id ?? "";
  return {
    id,
    name: raw.name?.trim() ?? "",
    email: raw.email?.trim() ?? "",
    role: raw.role ?? "user",
    phone: raw.phone,
  };
}

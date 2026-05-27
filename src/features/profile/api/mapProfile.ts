import type { UserProfile } from "../types";

export type RawProfileUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function mapProfile(raw: RawProfileUser): UserProfile {
  return {
    id: raw.id ?? raw._id ?? "",
    name: raw.name?.trim() ?? "",
    email: raw.email?.trim() ?? "",
    role: raw.role ?? "user",
    phone: raw.phone?.trim() || undefined,
    address: raw.address?.trim() || undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

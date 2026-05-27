import type { User } from "../../auth/types";
import type { UserProfile } from "../types";

export function profileToUser(profile: UserProfile): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    phone: profile.phone,
  };
}

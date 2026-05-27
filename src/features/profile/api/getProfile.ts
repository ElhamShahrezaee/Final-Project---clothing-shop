import { apiClient } from "../../../lib/api/client";
import { extractApiError } from "./extractApiError";
import { mapProfile, type RawProfileUser } from "./mapProfile";
import type { UserProfile } from "../types";

type GetProfileResponse = {
  success: boolean;
  data?: RawProfileUser;
  message?: string;
};

export async function getProfile(): Promise<UserProfile> {
  try {
    const res = await apiClient.get<GetProfileResponse>("/api/profile");

    if (!res.data?.success || !res.data.data) {
      throw new Error(res.data?.message || "Failed to load profile");
    }

    return mapProfile(res.data.data);
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to load profile"));
  }
}

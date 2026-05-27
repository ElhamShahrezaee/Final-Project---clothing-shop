import { apiClient } from "../../../lib/api/client";
import { extractApiError } from "./extractApiError";
import { mapProfile, type RawProfileUser } from "./mapProfile";
import type { UpdateProfilePayload, UserProfile } from "../types";

type UpdateProfileResponse = {
  success: boolean;
  data?: RawProfileUser;
  message?: string;
};

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  try {
    const res = await apiClient.put<UpdateProfileResponse>("/api/profile", payload);

    if (!res.data?.success || !res.data.data) {
      throw new Error(res.data?.message || "Failed to update profile");
    }

    return mapProfile(res.data.data);
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to update profile"));
  }
}

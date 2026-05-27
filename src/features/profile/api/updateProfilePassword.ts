import { apiClient } from "../../../lib/api/client";
import { extractApiError } from "./extractApiError";
import type { UpdatePasswordPayload } from "../types";

type UpdatePasswordResponse = {
  success: boolean;
  message?: string;
};

export async function updateProfilePassword(payload: UpdatePasswordPayload): Promise<void> {
  try {
    const res = await apiClient.put<UpdatePasswordResponse>("/api/profile/password", payload);

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Failed to update password");
    }
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to update password"));
  }
}

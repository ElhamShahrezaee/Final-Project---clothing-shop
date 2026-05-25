import axios from "axios";
import { API_BASE_URL } from "../../../lib/api/client";
import type { AuthScope } from "../../../lib/auth/tokenStorage";
import { getStoredToken } from "../storage";
import type { ApiResponse, User } from "../types";
import { mapAuthUser, type RawAuthUser } from "../utils/mapAuthUser";

function extractRawUser(data: unknown): RawAuthUser | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;

  if (record.user && typeof record.user === "object") {
    return record.user as RawAuthUser;
  }

  if (record._id || record.id || record.email) {
    return record as RawAuthUser;
  }

  return null;
}

export async function getCurrentUser(scope: AuthScope): Promise<User> {
  const token = getStoredToken(scope);

  try {
    const { data } = await axios.get<ApiResponse<unknown>>(`${API_BASE_URL}/api/auth/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const rawUser = extractRawUser(data.data);

    if (!data.success || !rawUser) {
      throw new Error(data.message || "خطا در دریافت اطلاعات کاربر");
    }

    return mapAuthUser(rawUser);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در دریافت اطلاعات کاربر";
      throw new Error(message);
    }
    throw error;
  }
}

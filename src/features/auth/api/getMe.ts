import axios from "axios";
import { API_BASE_URL } from "../../../lib/api/client";
import type { AuthScope } from "../../../lib/auth/tokenStorage";
import { getStoredToken } from "../storage";
import type { ApiResponse, User } from "../types";

export async function getCurrentUser(scope: AuthScope): Promise<User> {
  const token = getStoredToken(scope);

  try {
    const { data } = await axios.get<ApiResponse<{ user: User }>>(
      `${API_BASE_URL}/api/auth/me`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      },
    );

    if (!data.success || !data.data?.user) {
      throw new Error(data.message || "خطا در دریافت اطلاعات کاربر");
    }

    return data.data.user;
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

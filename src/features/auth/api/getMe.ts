import axios from "axios";
import { apiClient } from "../../../lib/api/client";
import type { ApiResponse, User } from "../types";

export async function getCurrentUser(): Promise<User> {
  try {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>(
      "/api/auth/me",
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

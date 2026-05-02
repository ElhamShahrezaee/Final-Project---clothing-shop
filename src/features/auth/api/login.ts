import axios from "axios";
import { apiClient } from "../../../lib/api/client";
import type { ApiResponse, LoginCredentials, LoginData } from "../types";

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginData> {
  try {
    const { data } = await apiClient.post<ApiResponse<LoginData>>(
      "/api/auth/login",
      credentials,
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "خطا در ورود");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در ورود";
      throw new Error(message);
    }
    throw error;
  }
}

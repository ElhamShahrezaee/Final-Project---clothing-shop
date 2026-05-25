import axios from "axios";
import { apiClient } from "../../../lib/api/client";
import type { ApiResponse, LoginData, RegisterPayload } from "../types";
import { mapAuthUser, type RawAuthUser } from "../utils/mapAuthUser";

export async function registerUserApi(payload: RegisterPayload): Promise<LoginData | null> {
  try {
    const { data } = await apiClient.post<ApiResponse<LoginData & { user?: RawAuthUser }>>(
      "/api/auth/register",
      payload,
    );

    if (!data.success) {
      throw new Error(data.message || "خطا در ثبت نام");
    }

    if (!data.data?.token || !data.data.user) {
      return null;
    }

    return {
      token: data.data.token,
      refreshToken: data.data.refreshToken,
      user: mapAuthUser(data.data.user),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در ثبت نام";
      throw new Error(message);
    }
    throw error;
  }
}

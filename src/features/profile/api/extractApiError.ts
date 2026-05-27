import axios from "axios";

type ApiErrorBody = {
  message?: string;
  success?: boolean;
};

export function extractApiError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as ApiErrorBody | undefined)?.message;
    if (message) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

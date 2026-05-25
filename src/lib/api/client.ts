import axios from "axios";
import { getStoredTokenForRequest } from "../auth/tokenStorage";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredTokenForRequest();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

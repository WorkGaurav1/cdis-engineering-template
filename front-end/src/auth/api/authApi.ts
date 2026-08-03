import { apiClient } from "@/api";

import type {
  LoginRequest,
  LoginResponse,
} from "../types";

export const authApi = {
  login(credentials: LoginRequest) {
    return apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
  },

  logout() {
    return apiClient.post("/auth/logout");
  },
};
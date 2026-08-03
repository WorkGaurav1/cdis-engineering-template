import { authApi } from "../api";
import { tokenStorage } from "../storage";

import type {
  LoginRequest,
  LoginResponse,
} from "../types";

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await authApi.login(credentials);

        tokenStorage.saveToken(response.accessToken);

        return response;
    },

    logout(): void {
        tokenStorage.clearToken();
    },
};
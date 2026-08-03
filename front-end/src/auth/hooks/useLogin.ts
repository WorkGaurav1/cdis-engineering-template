import { useState } from "react";

import { authService } from "@/auth/services";
import type { LoginRequest } from "../types";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  async function login(credentials: LoginRequest) {
    try {
      setLoading(true);

      const response = await authService.login(credentials);

      return response;
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    loading,
  };
}
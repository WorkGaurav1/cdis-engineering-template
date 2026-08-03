/**
 * Login request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response payload.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
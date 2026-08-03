import { httpClient } from "./httpClient";

/**
 * Register all request and response interceptors.
 */
export function registerInterceptors(): void {
  /**
   * Request interceptor
   */
  httpClient.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Response interceptor
   */
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
}
import { httpClient } from "./httpClient";

class ApiClient {
  async get<T>(url: string) {
    const response = await httpClient.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown) {
    const response = await httpClient.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown) {
    const response = await httpClient.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown) {
    const response = await httpClient.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string) {
    const response = await httpClient.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
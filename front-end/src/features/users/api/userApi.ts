import { apiClient, type Pagination } from "@/api";
import type { User } from "@/auth";

export interface ListUsersParams {
  limit: number;
  offset: number;
}

export const userApi = {
  list({ limit, offset }: ListUsersParams): Promise<{ users: User[]; pagination: Pagination }> {
    return apiClient.get<{ users: User[]; pagination: Pagination }>("/users", { limit, offset });
  },
};

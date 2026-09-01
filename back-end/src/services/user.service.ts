import { toSafeUser, type SafeUser } from "../mappers/user.mapper.js";
import { userRepository } from "../repositories/user.repository.js";

export interface UserListResult {
  users: SafeUser[];
  total: number;
}

export const userService = {
  async list(pagination: { limit: number; offset: number }): Promise<UserListResult> {
    const [users, total] = await Promise.all([userRepository.findAll(pagination), userRepository.count()]);

    return { users: users.map(toSafeUser), total };
  },
};

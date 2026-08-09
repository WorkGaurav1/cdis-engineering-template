import { toSafeUser, type SafeUser } from "../mappers/user.mapper.js";
import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  async list(): Promise<SafeUser[]> {
    const users = await userRepository.findAll();
    return users.map(toSafeUser);
  },
};

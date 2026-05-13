import { prisma } from "@/config/prisma.js";
import {
  userSafeSelect,
  UserSafe,
  RegisterInput,
  UserComplete,
  userCompleteSelect,
} from "./auth.types.js";

export class AuthRepository {
  // register function
  async createUser(data: RegisterInput): Promise<UserSafe> {
    return await prisma.user.create({
      data: {
        id: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        role: data.role,
        password: data.role,
      },
      select: userSafeSelect,
    });
  }
  // find by email
  async findByEmail(email: string): Promise<UserComplete | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: userCompleteSelect,
    });
  }
  // verify if an email already exist
  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
  // find by id
  async findById(id: string): Promise<UserSafe | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: userSafeSelect,
    });
  }
}

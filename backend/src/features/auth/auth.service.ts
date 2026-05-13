import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "@/shared/error/error.js";
import { AuthRepository } from "./auth.repository.js";
import {
  AuthResponse,
  JWTpayload,
  LoginInput,
  RegisterInput,
} from "./auth.types.js";
import { AUTH_ERRORS } from "@/constants/errorMessage.js";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { Prisma } from "@/generated/prisma/client.js";

// function tu generate Token
function generateToken(payload: JWTpayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "8h",
  });
}

// authService class
export class AuthService {
  //   construtor(private readonly authRepository: AuthRepository)
  constructor(private readonly authRepository: AuthRepository) {}

  //   register function
  async register(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      if (existingUser.deletedAt) {
        throw new ForbiddenError(AUTH_ERRORS.ACCOUNT_DELETED);
      } else {
        throw new ConflictError(AUTH_ERRORS.EMAIL_EXISTS);
      }
    }

    const hashedPassword = await argon2.hash(data.password);

    try {
      const user = await this.authRepository.createUser({
        ...data,
        password: hashedPassword,
      });
      const token = generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return { user, token };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictError(AUTH_ERRORS.EMAIL_EXISTS);
      }
      throw new InternalServerError(AUTH_ERRORS.FAILED_CREATION);
    }
  }

  // login function
  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS);
    } else if (!user.isActif) {
      throw new UnauthorizedError(AUTH_ERRORS.NOT_ACTIVATE);
    }

    const isMatch = await argon2.verify(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

// export an instance of the authService
export const authService = new AuthService(new AuthRepository());

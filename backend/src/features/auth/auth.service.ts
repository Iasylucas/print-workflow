import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
  BadRequestError,
} from "@/shared/error/error.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthResponse, JWTpayload } from "./auth.types.js";
import { UserSafe } from "@/shared/types/user.types.js";
import {
  InviteUserInput,
  FinalizeRegistrationInput,
  LoginInput,
} from "./auth.types.js";
import { AUTH_ERRORS } from "@/constants/errorMessage.js";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { Prisma } from "@/generated/prisma/client.js";
import crypto from "node:crypto";
import { v7 as uuidv7 } from "uuid";
import { sendEmail } from "@/shared/infrastructure/mail/mail.service.js";
import { getInvitationTemplate } from "@/shared/infrastructure/mail/templates/invitation.template.js";

// function to genrate token
function generateToken(payload: JWTpayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "8h",
  });
}

// class de service d'authentification
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  //1. INVITATION (Action de l'Admin)
  async invite(data: InviteUserInput): Promise<{ user: UserSafe }> {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      if (existingUser.deletedAt) {
        throw new ForbiddenError(AUTH_ERRORS.ACCOUNT_DELETED);
      }
      throw new ConflictError(AUTH_ERRORS.EMAIL_EXISTS);
    }

    const plainToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    try {
      const user = await this.authRepository.createInvitedUser(data);

      await this.authRepository.createInvitationToken({
        id: uuidv7(),
        tokenHash,
        email: data.email,
        role: data.role,
        expiresAt,
        userId: user.id,
      });

      const activationUrl = `${env.FRONTEND_URL}/finalize?token=${plainToken}`;

      await sendEmail(
        user.email,
        "Invitation à rejoindre l'ERP EWA Print",
        getInvitationTemplate(activationUrl, user.role),
      );

      return { user };
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

  //  2. FINALISATION (Action du collaborateur invité)
  async finalizeRegistration(
    data: FinalizeRegistrationInput,
  ): Promise<AuthResponse> {
    const tokenHash = crypto
      .createHash("sha256")
      .update(data.token)
      .digest("hex");

    const invitation =
      await this.authRepository.findInvitationByToken(tokenHash);

    if (!invitation) {
      throw new BadRequestError(AUTH_ERRORS.INVITATION_NOT_FOUND);
    }

    if (invitation.usedAt) {
      throw new ConflictError(AUTH_ERRORS.INVITATION_USED);
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestError(AUTH_ERRORS.INVITATION_EXPIRED);
    }

    const hashedPassword = await argon2.hash(data.password);

    // Déclenchement de la transaction atomique (Mise à jour User + Clôture Token)
    const user = await this.authRepository.finalizeUserRegistration(
      invitation.userId,
      invitation.id,
      {
        avatarUrl: data.avatarUrl,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: hashedPassword,
      },
    );

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  //  3. CONNEXION (Login standard)
  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email);

    // Protection contre l'énumération de comptes : message identique
    if (!user) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    if (user.deletedAt) {
      throw new ForbiddenError(AUTH_ERRORS.ACCOUNT_DELETED);
    }

    if (!user.isActive) {
      throw new UnauthorizedError(AUTH_ERRORS.NOT_ACTIVATE);
    }

    if (!user.password) {
      throw new UnauthorizedError(AUTH_ERRORS.NOT_ACTIVATE);
    }

    const isMatch = await argon2.verify(user.password, data.password);

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
        avatarUrl: user.avatarUrl,
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

// Export d'une instance du service avec le repository injecté (DI simple)
export const authService = new AuthService(new AuthRepository());

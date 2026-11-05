import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from "@/shared/error/error.js";
import { AuthRepository } from "./auth.repository.js";
import {
  AuthResponse,
  ChangePasswordInput,
  JWTpayload,
  InviteUserInput,
  FinalizeRegistrationInput,
  LoginInput,
  InvitationResponse,
} from "./auth.types.js";
import { AUTH_ERRORS } from "./auth.constants.js";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { Prisma } from "@/generated/prisma/client.js";
import crypto from "node:crypto";
import { v7 as uuidv7 } from "uuid";
import { sendEmail } from "@/shared/infrastructure/mail/mail.service.js";
import { getInvitationTemplate } from "@/shared/infrastructure/mail/templates/invitation.template.js";
import { getResetPasswordTemplate } from "@/shared/infrastructure/mail/templates/password-reset-request.template.js";
import { UserRepository } from "../user/user.repository.js";

function generateToken(payload: JWTpayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "8h",
  });
}

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async invite(data: InviteUserInput): Promise<InvitationResponse> {
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
      await this.authRepository.createInvitationToken({
        id: uuidv7(),
        tokenHash,
        email: data.email,
        role: data.role,
        expiresAt,
      });

      const activationUrl = `${env.FRONTEND_URL}/finalize?token=${plainToken}`;

      await sendEmail(
        data.email,
        "Invitation à rejoindre l'ERP EWA Print",
        getInvitationTemplate(activationUrl, data.role),
      );

      return { data };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictError(AUTH_ERRORS.EMAIL_EXISTS);
      }
      throw new InternalServerError(error as any);
    }
  }

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

    const user = await this.authRepository.finalizeUserRegistration(
      invitation.id,
      {
        id: data.id,
        avatarUrl: data.avatarUrl,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
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

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email);

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
        isActive: user.isActive,
        phone: user.phone,
        address: user.address,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async changePassword(
    userId: string,
    data: ChangePasswordInput,
  ): Promise<void> {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_ERRORS.USER_NOT_FOUND);
    }

    if (!user.password) {
      throw new BadRequestError(AUTH_ERRORS.NO_PASSWORD_SET);
    }

    const isMatch = await argon2.verify(user.password, data.currentPassword);
    if (!isMatch) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CURRENT_PASSWORD);
    }

    const hashedPassword = await argon2.hash(data.newPassword);
    await this.authRepository.updatePassword(userId, hashedPassword);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.authRepository.findByEmail(email);

    if (!user || user.deletedAt) {
      return;
    }

    await this.authRepository.deleteOldPasswordResetTokens(user.id);

    const plainToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.authRepository.createPasswordResetToken({
      id: uuidv7(),
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${plainToken}`;

    await sendEmail(
      user.email,
      "Réinitialisation de votre mot de passe",
      getResetPasswordTemplate(resetUrl),
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const tokenRecord =
      await this.authRepository.findPasswordResetTokenByHash(tokenHash);

    if (!tokenRecord) {
      throw new BadRequestError(AUTH_ERRORS.INVALID_TOKEN);
    }

    if (tokenRecord.usedAt) {
      throw new BadRequestError(AUTH_ERRORS.TOKEN_ALREADY_USED);
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw new BadRequestError(AUTH_ERRORS.TOKEN_EXPIRED);
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.authRepository.updatePassword(
      tokenRecord.userId,
      hashedPassword,
    );
    await this.authRepository.markPasswordResetTokenAsUsed(tokenRecord.id);
  }

  async confirmEmailChange(token: string): Promise<void> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const request =
      await this.userRepository.findEmailChangeRequestByTokenHash(tokenHash);

    if (!request) {
      throw new BadRequestError(AUTH_ERRORS.INVALID_TOKEN);
    }

    if (request.usedAt) {
      throw new BadRequestError(AUTH_ERRORS.TOKEN_ALREADY_USED);
    }

    if (new Date() > request.expiresAt) {
      throw new BadRequestError(AUTH_ERRORS.TOKEN_EXPIRED);
    }

    await this.userRepository.updateUserEmail(request.userId, request.newEmail);

    await this.userRepository.markEmailChangeRequestAsUsed(request.id);
  }

  async getMe(userId: string): Promise<{ user: any }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_ERRORS.USER_NOT_FOUND);
    }
    if (!user.isActive) {
      throw new UnauthorizedError(AUTH_ERRORS.NOT_ACTIVATE);
    }
    return { user };
  }
}

export const authService = new AuthService(
  new AuthRepository(),
  new UserRepository(),
);

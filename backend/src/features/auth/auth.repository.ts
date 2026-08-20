import { prisma } from "@/config/prisma.js";
import {
  InviteUserInput,
  FinalizeRegistrationInput,
  inviteData,
} from "./auth.types.js";
import { findUserByEmail } from "@/utils/index.js";
import {
  userSafeSelect,
  UserSafe,
  UserComplete,
  userCompleteSelect,
} from "@/shared/types/user.types.js";
import { uuidv7 } from "zod";

export class AuthRepository {
  async createInvitationToken(inviteData: inviteData): Promise<void> {
    await prisma.invitationToken.create({
      data: {
        id: inviteData.id,
        token: inviteData.tokenHash,
        email: inviteData.email,
        role: inviteData.role as any,
        expiresAt: inviteData.expiresAt,
      },
    });
  }

  async findInvitationByToken(tokenHash: string) {
    return await prisma.invitationToken.findUnique({
      where: { token: tokenHash },
    });
  }

  async finalizeUserRegistration(
    tokenId: string,
    data: Omit<
      FinalizeRegistrationInput,
      "token" | "confirmPassword" | "password"
    > & {
      passwordHash: string;
    },
  ): Promise<UserSafe> {
    return await prisma.$transaction(async (tx) => {
      const invitation = await tx.invitationToken.findUnique({
        where: { id: tokenId },
      });

      if (!invitation) {
        throw new Error("Invitation introuvable dans la transaction.");
      }

      const createdUser = await tx.user.create({
        data: {
          id: data.id,
          email: invitation.email,
          role: invitation.role,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address ?? null,
          password: data.passwordHash,
          isActive: true,
        },
        select: userSafeSelect,
      });

      await tx.invitationToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      });

      return createdUser;
    });
  }

  async findByEmail(email: string): Promise<UserComplete | null> {
    return await findUserByEmail(email, userCompleteSelect);
  }

  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async findById(id: string): Promise<UserComplete | null> {
    return await prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: userCompleteSelect,
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async deleteOldPasswordResetTokens(userId: string) {
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });
  }

  async createPasswordResetToken(data: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    await prisma.passwordResetToken.create({
      data: {
        id: data.id,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        userId: data.userId,
      },
    });
  }

  async findPasswordResetTokenByHash(tokenHash: string) {
    return await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: { select: userSafeSelect } },
    });
  }

  async markPasswordResetTokenAsUsed(tokenId: string) {
    await prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  }
}

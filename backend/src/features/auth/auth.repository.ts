import { prisma } from "@/config/prisma.js";
import { InviteUserInput, FinalizeRegistrationInput } from "./auth.types.js";
import { findUserByEmail } from "@/utils/index.js";

import {
  userSafeSelect,
  UserSafe,
  UserComplete,
  userCompleteSelect,
} from "@/shared/types/user.types.js";

type inviteData = {
  id: string;
  tokenHash: string;
  email: string;
  role: string;
  expiresAt: Date;
  userId: string;
};

export class AuthRepository {
  // 1.Crée un utilisateur partiel (invité par l'admin)
  async createInvitedUser(data: InviteUserInput): Promise<UserSafe> {
    return await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        role: data.role,
        isActive: false,
      },
      select: userSafeSelect,
    });
  }
  //  2.Enregistre le token d'invitation lié à l'utilisateur
  async createInvitationToken(inviteData: inviteData): Promise<void> {
    await prisma.invitationToken.create({
      data: {
        id: inviteData.id,
        token: inviteData.tokenHash, // Le hash SHA-256 sécurisé
        email: inviteData.email,
        role: inviteData.role as any, // Cast selon ton enum Prisma
        expiresAt: inviteData.expiresAt,
        userId: inviteData.userId,
      },
    });
  }
  //3.Recherche un token d'invitation pour vérification
  async findInvitationByToken(tokenHash: string) {
    return await prisma.invitationToken.findUnique({
      where: { token: tokenHash },
    });
  }

  //  4.Finalise l'inscription (Transaction Atomique)
  async finalizeUserRegistration(
    userId: string,
    tokenId: string,
    data: Omit<
      FinalizeRegistrationInput,
      "token" | "confirmPassword" | "password"
    > & {
      passwordHash: string;
    },
  ): Promise<UserSafe> {
    return await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.passwordHash,
          isActive: true,
        },
        select: userSafeSelect,
      });
      await tx.invitationToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      });

      return updatedUser;
    });
  }

  // fonction utilitaire pour la connexion classique
  async findByEmail(email: string): Promise<UserComplete | null> {
    return await findUserByEmail(email);
  }

  // Vérifie si un utilisateur existe déjà avec cet email (pour éviter les doublons)
  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  // fonction utilitaire pour la récupération d'un utilisateur par son ID
  async findById(id: string): Promise<UserComplete | null> {
    return await prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: userCompleteSelect,
    });
  }

  // fonction pour mettre à jour le mot de passe d'un utilisateur
  async updatePassword(userId: string, hashedPassword: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  // Supprimer les anciens tokens non utilisés d’un utilisateur
  async deleteOldPasswordResetTokens(userId: string) {
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });
  }

  // Créer un token de réinitialisation de mot de passe
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

  // Rechercher un token par son hash
  async findPasswordResetTokenByHash(tokenHash: string) {
    return await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  // Marquer un token comme utilisé
  async markPasswordResetTokenAsUsed(tokenId: string) {
    await prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  }
}

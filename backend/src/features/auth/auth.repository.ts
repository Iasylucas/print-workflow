import { prisma } from "@/config/prisma.js";
import {
  userSafeSelect,
  UserSafe,
  UserComplete,
  userCompleteSelect,
  InviteUserInput,
  FinalizeRegistrationInput,
} from "./auth.types.js";

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
        isActif: false,
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
          isActif: true,
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
    return await prisma.user.findUnique({
      where: { email },
      select: userCompleteSelect,
    });
  }

  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async findById(id: string): Promise<UserSafe | null> {
    return await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }
}

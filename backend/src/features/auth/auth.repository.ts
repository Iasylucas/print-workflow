import { prisma } from "@/config/prisma.js";
import {
  userSafeSelect,
  UserSafe,
  RegisterInput,
  UserComplete,
  userCompleteSelect,
} from "./auth.types.js";

export class AuthRepository {
  /**
   * ÉTAPE 1 : Crée un utilisateur partiel (invité par l'admin)
   */
  async createInvitedUser(data: InviteUserInput): Promise<UserSafe> {
    return await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        role: data.role,
        isActif: false, // Reste inactif tant qu'il n'a pas validé
        // password, firstName, lastName restent NULL en DB
      },
      select: userSafeSelect,
    });
  }

  /**
   * ÉTAPE 2 : Enregistre le token d'invitation lié à l'utilisateur
   */
  async createInvitationToken(inviteData: {
    id: string;
    tokenHash: string;
    email: string;
    role: string;
    expiresAt: Date;
    userId: string;
  }): Promise<void> {
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

  /**
   * ÉTAPE 3 : Recherche un token d'invitation pour vérification
   */
  async findInvitationByToken(tokenHash: string) {
    return await prisma.invitationToken.findUnique({
      where: { token: tokenHash },
    });
  }

  /**
   * ÉTAPE 4 : Finalise l'inscription (Transaction Atomique)
   * Met à jour l'user ET marque le token comme utilisé en même temps.
   */
  async finalizeUserRegistration(
    userId: string,
    tokenId: string,
    data: Omit<FinalizeRegistrationInput, "token" | "confirmPassword"> & {
      passwordHash: string;
    },
  ): Promise<UserSafe> {
    // $transaction garantit que si une étape plante, rien n'est enregistré
    return await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour l'utilisateur pour le rendre actif
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstname,
          lastName: data.lastname,
          password: data.passwordHash,
          isActif: true,
        },
        select: userSafeSelect,
      });

      // 2. Marquer le token comme utilisé
      await tx.invitationToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      });

      return updatedUser;
    });
  }

  // --- Les fonctions utilitaires existantes restent identiques ---
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

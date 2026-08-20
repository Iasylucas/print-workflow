import {
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadRequestError,
} from "@/shared/error/error.js";
import { UserRepository } from "./user.repository.js";
import {
  UpdateUserInput,
  UpdateProfileInput,
  UserQuery,
  InvitationQuery,
  PaginatedInvitationList,
} from "./user.types.js";
import { UserSafe } from "@/shared/types/user.types.js";
import { INVITATION_ERRORS, USER_ERRORS } from "./user.constants.js";
import { v7 as uuidv7 } from "uuid";
import { env } from "@/config/env.js";
import { sendEmail } from "@/shared/infrastructure/mail/mail.service.js";
import crypto from "node:crypto";
import { getEmailChangeRequestTemplate } from "@/shared/infrastructure/mail/templates/email-change-request.template.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserSafe> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(USER_ERRORS.NOT_FOUND);
    }
    return user;
  }

  async listUsers(query: UserQuery) {
    return await this.userRepository.findAllPaginated(query);
  }

  async updateUser(
    id: string,
    currentUserId: string,
    data: UpdateUserInput,
  ): Promise<UserSafe> {
    if (id === currentUserId) {
      if (data.isActive === false) {
        throw new ConflictError(USER_ERRORS.CANNOT_DEACTIVATE_OWN_ACCOUNT);
      }
      if (
        data.role &&
        data.role !== (await this.userRepository.findById(id))?.role
      ) {
        throw new ConflictError(USER_ERRORS.CANNOT_UPDATE_OWN_ROLE);
      }
    }

    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(USER_ERRORS.NOT_FOUND);
    }

    try {
      const updated = await this.userRepository.update(id, data);
      return updated;
    } catch (error) {
      throw new InternalServerError(USER_ERRORS.FAILED_UPDATE);
    }
  }

  async deleteUser(id: string, currentUserId: string): Promise<void> {
    if (id === currentUserId) {
      throw new ConflictError(USER_ERRORS.CANNOT_DELETE_OWN_ACCOUNT);
    }

    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(USER_ERRORS.NOT_FOUND);
    }

    try {
      await this.userRepository.hardDelete(id);
    } catch (error) {
      throw new InternalServerError(USER_ERRORS.FAILED_DELETE);
    }
  }

  async getMyProfile(userId: string): Promise<UserSafe> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(USER_ERRORS.NOT_FOUND);
    }
    return user;
  }

  async updateMyProfile(
    userId: string,
    data: UpdateProfileInput,
  ): Promise<UserSafe> {
    const existing = await this.userRepository.findById(userId);
    if (!existing) {
      throw new NotFoundError(USER_ERRORS.NOT_FOUND);
    }

    try {
      const updated = await this.userRepository.update(userId, data);
      return updated;
    } catch (error) {
      throw new InternalServerError(USER_ERRORS.FAILED_UPDATE);
    }
  }

  async adminInitiateEmailChange(
    userId: string,
    newEmail: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(USER_ERRORS.NOT_FOUND);
    }

    const existingUser = await this.userRepository.findByEmail(newEmail);
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictError(USER_ERRORS.EMAIL_EXISTS);
    }

    if (user.email === newEmail) {
      throw new BadRequestError(
        "New email must be different from current email",
      );
    }

    await this.userRepository.deleteOldEmailChangeRequests(userId);

    const plainToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.createEmailChangeRequest({
      id: uuidv7(),
      userId: user.id,
      newEmail,
      tokenHash,
      expiresAt,
    });

    const confirmUrl = `${env.FRONTEND_URL}/confirm-email-change?token=${plainToken}`;
    await sendEmail(
      newEmail,
      "Confirmation de changement d'email",
      getEmailChangeRequestTemplate(confirmUrl, user.email),
    );
  }

  async listInvitations(
    query: InvitationQuery,
  ): Promise<PaginatedInvitationList> {
    try {
      return await this.userRepository.findAllInvitationsPaginated(query);
    } catch (error) {
      throw new InternalServerError(INVITATION_ERRORS.FAILED_FETCHING);
    }
  }

  async cancelInvitation(id: string): Promise<void> {
    const invitation = await this.userRepository.findInvitationById(id);
    if (!invitation) {
      throw new NotFoundError(INVITATION_ERRORS.NOT_FOUND);
    }

    try {
      await this.userRepository.deleteInvitation(id);
    } catch (error) {
      throw new InternalServerError(INVITATION_ERRORS.FAILED_DELETE);
    }
  }
}

export const userService = new UserService(new UserRepository());

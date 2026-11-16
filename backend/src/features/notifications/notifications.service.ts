import { InternalServerError } from "@/shared/error/error.js";
import { NotificationsRepository } from "./notifications.repository.js";
import { NOTIFICATIONS_ERRORS } from "./notifications.constants.js";
import {
  NotificationsQuery,
  PaginatedNotificationsList,
  UnreadCountOutput,
} from "./notifications.types.js";
import { UserRepository } from "../user/user.repository.js";
import { Prisma } from "@/generated/prisma/client.js";

export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly usersRepository: UserRepository,
  ) {}

  async list(
    userId: string,
    query: NotificationsQuery,
  ): Promise<PaginatedNotificationsList> {
    try {
      return await this.notificationsRepository.findAllByUser(userId, query);
    } catch {
      throw new InternalServerError(NOTIFICATIONS_ERRORS.FETCH_FAILED);
    }
  }

  async getUnreadCount(userId: string): Promise<UnreadCountOutput> {
    try {
      const count = await this.notificationsRepository.countUnread(userId);
      return { count };
    } catch {
      throw new InternalServerError(NOTIFICATIONS_ERRORS.FETCH_FAILED);
    }
  }

  async markAsRead(id: number, userId: string): Promise<void> {
    try {
      await this.notificationsRepository.markAsRead(id, userId);
    } catch {
      throw new InternalServerError(NOTIFICATIONS_ERRORS.MARK_READ_FAILED);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await this.notificationsRepository.markAllAsRead(userId);
    } catch {
      throw new InternalServerError(NOTIFICATIONS_ERRORS.MARK_ALL_READ_FAILED);
    }
  }

  async delete(id: number, userId: string): Promise<void> {
    try {
      await this.notificationsRepository.delete(id, userId);
    } catch {
      throw new InternalServerError(NOTIFICATIONS_ERRORS.DELETE_FAILED);
    }
  }
  async notifyRoles(
    tx: Prisma.TransactionClient,
    roles: string[],
    data: {
      type: string;
      title: string;
      message: string;
      link?: string | null;
      orderId?: number | null;
      metadata?: Prisma.InputJsonValue | null;
    },
  ): Promise<void> {
    const users = await this.usersRepository.findActiveByRoles(roles);
    if (users.length === 0) return;

    await this.notificationsRepository.createMany(
      tx,
      users.map((u) => ({
        userId: u.id,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link ?? null,
        orderId: data.orderId ?? null,
        metadata: data.metadata ?? null,
      })),
    );
  }

  async notifyUser(
    tx: Prisma.TransactionClient,
    userId: string,
    data: {
      type: string;
      title: string;
      message: string;
      link?: string | null;
      orderId?: number | null;
      metadata?: Prisma.InputJsonValue | null;
    },
  ): Promise<void> {
    await this.notificationsRepository.create(tx, {
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link ?? null,
      orderId: data.orderId ?? null,
      metadata: data.metadata ?? null,
    });
  }
}

export const notificationsService = new NotificationsService(
  new NotificationsRepository(),
  new UserRepository(),
);

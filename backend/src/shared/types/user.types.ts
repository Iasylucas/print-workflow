import { Prisma } from "@/generated/prisma/client.js";

export const userSafeSelect = {
  id: true,
  avatarUrl: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userCompleteSelect = {
  ...userSafeSelect,
  isActive: true,
  deletedAt: true,
  password: true,
} satisfies Prisma.UserSelect;

export type UserSafe = Prisma.UserGetPayload<{ select: typeof userSafeSelect }>;

export type UserComplete = Prisma.UserGetPayload<{
  select: typeof userCompleteSelect;
}>;

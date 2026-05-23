import { prisma } from "@/config/prisma.js";

export const findUserByEmail = async (email: string, selected: {} | null) => {
  return await prisma.user.findUnique({
    where: { email },
    select: selected,
  });
};

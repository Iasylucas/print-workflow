import { prisma } from "@/config/prisma.js";
import { userCompleteSelect } from "@/shared/types/user.types.js";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: userCompleteSelect,
  });
};

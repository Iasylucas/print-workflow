import { prisma } from "@/config/prisma.js";
import { userCompleteSelect } from "@/shared/types/user.types.js";

export const findUserByEmail = async (email: string, selected: {} | null) => {
  return await prisma.user.findUnique({
    where: { email },
    select: selected,
  });
};

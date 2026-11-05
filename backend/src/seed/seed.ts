import { prisma } from "@/config/prisma.js";
import * as argon2 from "argon2";
import { v7 as uuidv7 } from "uuid";

async function main() {
  const adminEmail = "admin@ewaprint.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await argon2.hash("Admin123");

    await prisma.user.create({
      data: {
        id: uuidv7(),
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        firstName: "Super",
        lastName: "Admin",
      },
    });
    console.log("Seed: Admin user created.");
  } else {
    console.log("Seed: Admin already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

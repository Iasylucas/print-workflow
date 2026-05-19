import { prisma } from "@/config/prisma.js";
import * as argon2 from "argon2";
import { v7 as uuidv7 } from "uuid";

const firstNames = [
  "Jean",
  "Marie",
  "Pierre",
  "Paul",
  "Jacques",
  "André",
  "Louis",
  "Charles",
  "François",
  "Antoine",
  "Sophie",
  "Isabelle",
  "Catherine",
  "Nathalie",
  "Julie",
  "Christine",
  "Sylvie",
  "Martine",
  "Anne",
  "Valérie",
  "Lucas",
  "Hugo",
  "Jules",
  "Raphaël",
  "Arthur",
  "Nathan",
  "Théo",
  "Louis",
  "Adam",
  "Maxime",
  "Chloé",
  "Manon",
  "Emma",
  "Léa",
  "Inès",
  "Sarah",
  "Camille",
  "Juliette",
  "Victoria",
  "Margaux",
];

const lastNames = [
  "Martin",
  "Bernard",
  "Dubois",
  "Thomas",
  "Robert",
  "Richard",
  "Petit",
  "Durand",
  "Leroy",
  "Moreau",
  "Simon",
  "Laurent",
  "Michel",
  "Lefebvre",
  "Garcia",
  "David",
  "Bertrand",
  "Roux",
  "Vincent",
  "Fournier",
];

const cities = [
  "Antananarivo",
  "Tamatave",
  "Mahajanga",
  "Fianarantsoa",
  "Antsirabe",
  "Toliara",
  "Antsiranana",
  "Ambovombe",
  "Manakara",
  "Morondava",
];

const streets = [
  "Rue de l'Indépendance",
  "Avenue de France",
  "Boulevard de la Liberté",
  "Rue du Commerce",
  "Avenue du 26 Juin",
  "Rue de la Paix",
  "Boulevard de Tananarive",
  "Rue du Docteur Raseta",
  "Avenue de l'Indépendance",
  "Rue de la République",
];

function randomPhone(): string {
  const prefixes = ["032", "033", "034", "038", "039"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return `${prefix} ${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)} ${number.slice(6, 7)}`;
}

function randomEmail(firstName: string | null, lastName: string): string {
  const domains = [
    "gmail.com",
    "yahoo.fr",
    "hotmail.com",
    "orange.mg",
    "moov.mg",
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const firstPart = firstName
    ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
    : lastName.toLowerCase();
  const randomNum = Math.floor(Math.random() * 999);
  return `${firstPart}${randomNum}@${domain}`;
}

async function main() {
  console.log("🌱 Seeding 75 clients...");

  const clients = [];

  for (let i = 0; i < 75; i++) {
    const firstName: string | null =
      Math.random() > 0.1
        ? firstNames[Math.floor(Math.random() * firstNames.length)]!
        : null;
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]!;
    const hasEmail = Math.random() > 0.05; // 95% ont un email
    const hasPhone = Math.random() > 0.05; // 95% ont un téléphone
    const hasAddress = Math.random() > 0.1; // 90% ont une adresse

    const client = {
      id: uuidv7(),
      firstName,
      lastName,
      email: hasEmail ? randomEmail(firstName, lastName) : null,
      phone: hasPhone ? randomPhone() : null,
      address: hasAddress
        ? `${Math.floor(Math.random() * 200) + 1} ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`
        : null,
    };

    clients.push(client);
  }

  await prisma.client.createMany({
    data: clients,
    skipDuplicates: true,
  });

  console.log(`✅ ${clients.length} clients créés avec succès !`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

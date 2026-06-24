import { prisma } from "@/config/prisma.js";
import { PricingMode } from "@/generated/prisma/client.js";

async function main() {
  console.log("🚀 Début du seeding du catalogue de l'imprimerie...");

  // Nettoyage préalable pour éviter les doublons si le script est relancé
  await prisma.pricingRule.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});

  // 1. MODULE : VINYLE & SUPPORTS GRAND FORMAT
  await prisma.product.create({
    data: {
      name: "Vinyle Autocollant",
      slug: "vinyle-autocollant",
      variants: {
        create: [
          {
            name: "Prédécoupé",
            pricingRules: {
              create: {
                pricingMode: PricingMode.COMPOSITE,
                config: { per_m2: 22000, A4: 2500 },
              },
            },
          },
          {
            name: "Sans Découpe",
            pricingRules: {
              create: {
                pricingMode: PricingMode.PER_M2,
                config: { per_m2: 18000 },
              },
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Bâche publicitaire & Dos bleu",
      slug: "bache-dos-bleu",
      variants: {
        create: [
          {
            name: "Standard",
            pricingRules: {
              create: {
                pricingMode: PricingMode.PER_M2,
                config: { per_m2: 18000 },
              },
            },
          },
        ],
      },
    },
  });

  // 2. MODULE : SUPPORTS RIGIDES (PVC)
  await prisma.product.create({
    data: {
      name: "Panneau PVC",
      slug: "panneau-pvc",
      variants: {
        create: [
          {
            name: "Standard",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FORMAT,
                config: {
                  A4: 10000,
                  A3: 15000,
                  A2: 22000,
                  A1: 40000,
                  max: 72000,
                },
              },
            },
          },
        ],
      },
    },
  });

  // 3. MODULE : IMPRESSION NUMÉRIQUE STANDARD (PAPIER, CARTE, FLYERS)
  await prisma.product.create({
    data: {
      name: "Papier Autocollant",
      slug: "papier-autocollant",
      variants: {
        create: [
          {
            name: "Standard",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FORMAT,
                config: { A4: 2000 },
              },
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Carte de Visite",
      slug: "carte-de-visite",
      variants: {
        create: [
          {
            name: "Recto Seul",
            pricingRules: {
              create: {
                pricingMode: PricingMode.PER_UNIT,
                config: { unit: 150 },
              },
            },
          },
          {
            name: "Recto Verso",
            pricingRules: {
              create: {
                pricingMode: PricingMode.PER_UNIT,
                config: { unit: 300 },
              },
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Flyers",
      slug: "flyers",
      variants: {
        create: [
          {
            name: "Recto",
            pricingRules: {
              create: {
                pricingMode: PricingMode.RECTO_VERSO,
                config: { A4: 1200, A3: 2400 },
              },
            },
          },
          {
            name: "Recto Verso",
            pricingRules: {
              create: {
                pricingMode: PricingMode.RECTO_VERSO,
                config: { A4: 1800, A3: 3600 },
              },
            },
          },
        ],
      },
    },
  });

  // 4. MODULE : SIGNALÉTIQUE AUTOPORTANTE (ROLLUP, ORIFLAMME)
  await prisma.product.create({
    data: {
      name: "Rollup",
      slug: "rollup",
      variants: {
        create: [
          {
            name: "Standard",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { unit: 210000 },
              },
            },
          },
          {
            name: "Deluxe",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { unit: 270000 },
              },
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Oriflamme (Drapeau)",
      slug: "oriflamme",
      variants: {
        create: [
          {
            name: "Standard",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { "2.8m": 200000, "3.5m": 240000, "4.5m": 300000 },
              },
            },
          },
        ],
      },
    },
  });

  // 5. MODULE : TEXTILE & MARQUAGE (DTF, FLEX)
  await prisma.product.create({
    data: {
      name: "Métrage DTF",
      slug: "metrage-dtf",
      variants: {
        create: [
          {
            name: "Standard",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FORMAT,
                config: { A4: 10000, "1m*60cm": 22000 },
              },
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "T-Shirt Personnalisé",
      slug: "t-shirt-personnalise",
      variants: {
        create: [
          {
            name: "Marquage DTF",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { unit: 21000 },
              },
            },
          },
          {
            name: "Marquage Flex",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { unit: 28000 },
              },
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Polo Personnalisé",
      slug: "polo-personnalise",
      variants: {
        create: [
          {
            name: "Marquage DTF",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { unit: 30000 },
              },
            },
          },
          {
            name: "Marquage Flex",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { unit: 38000 },
              },
            },
          },
        ],
      },
    },
  });

  // 6. MODULE : GOODIES
  await prisma.product.create({
    data: {
      name: "Mug Souvenir",
      slug: "mug-souvenir",
      variants: {
        create: [
          {
            name: "Standard",
            pricingRules: {
              create: {
                pricingMode: PricingMode.FIXED,
                config: { unit: 14000 },
              },
            },
          },
        ],
      },
    },
  });

  console.log("✨ Catalogue complet inséré avec succès en Ariary !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

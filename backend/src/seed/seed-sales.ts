// // import "dotenv/config";
// // import { PrismaClient } from "../generated/prisma/client.js";
// // import { PrismaPg } from "@prisma/adapter-pg";
// // import pg from "pg";
// // import { randomUUID } from "node:crypto";

// // const connectionString = process.env.DATABASE_URL;
// // if (!connectionString) {
// //   throw new Error("DATABASE_URL manquant dans .env");
// // }
// // const pool = new pg.Pool({ connectionString });
// // const adapter = new PrismaPg(pool);
// // const prisma = new PrismaClient({ adapter });

// // // ============================================================
// // // IDs FIXES (à conserver)
// // // ============================================================
// // const COMPANY_INFO_ID = 36;

// // const ADMIN_ID = "019e3ef9-710b-777c-83d0-3f4644383d8b";

// // const SALES_IDS = [
// //   "019e549a-e705-71fa-b978-17de481e68d8", // Jean-Pierre Dupont
// //   "019e3ef9-710b-777c-83d0-3f4644383d25", // Antoine Muller
// //   "019e3ef9-710b-777c-83d0-3f4644383d24", // Romane Faure
// //   "019e3ef9-710b-777c-83d0-3f4644383d23", // Julien Morin
// //   "019e3ef9-710b-777c-83d0-3f4644383d22", // Clara Gauthier
// //   "019e3ef9-710b-777c-83d0-3f4644383d21", // Paul Brunet
// // ];

// // // ============================================================
// // // CATALOGUE
// // // ============================================================
// // type CatalogEntry = {
// //   productId: number;
// //   productName: string;
// //   variantId: number;
// //   variantName: string;
// //   pricingMode: string;
// //   config: Record<string, number>;
// //   weight: number;
// // };

// // const CATALOG: CatalogEntry[] = [
// //   {
// //     productId: 1,
// //     productName: "Vinyle Autocollant",
// //     variantId: 1,
// //     variantName: "Prédécoupé",
// //     pricingMode: "COMPOSITE",
// //     config: { A4: 2500, per_m2: 22000 },
// //     weight: 3,
// //   },
// //   {
// //     productId: 1,
// //     productName: "Vinyle Autocollant",
// //     variantId: 2,
// //     variantName: "Sans Découpe",
// //     pricingMode: "PER_M2",
// //     config: { per_m2: 18000 },
// //     weight: 2,
// //   },
// //   {
// //     productId: 2,
// //     productName: "Bâche publicitaire",
// //     variantId: 3,
// //     variantName: "Standard",
// //     pricingMode: "PER_M2",
// //     config: { per_m2: 18000 },
// //     weight: 2,
// //   },
// //   {
// //     productId: 3,
// //     productName: "Panneau PVC",
// //     variantId: 4,
// //     variantName: "Standard",
// //     pricingMode: "FORMAT",
// //     config: { A1: 40000, A2: 22000, A3: 15000, A4: 10000, max: 72000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 4,
// //     productName: "Papier Autocollant",
// //     variantId: 5,
// //     variantName: "Standard",
// //     pricingMode: "FORMAT",
// //     config: { A4: 2000 },
// //     weight: 2,
// //   },
// //   {
// //     productId: 5,
// //     productName: "Carte de Visite",
// //     variantId: 6,
// //     variantName: "Recto Seul",
// //     pricingMode: "PER_UNIT",
// //     config: { unit: 150 },
// //     weight: 4,
// //   },
// //   {
// //     productId: 5,
// //     productName: "Carte de Visite",
// //     variantId: 7,
// //     variantName: "Recto Verso",
// //     pricingMode: "PER_UNIT",
// //     config: { unit: 300 },
// //     weight: 3,
// //   },
// //   {
// //     productId: 6,
// //     productName: "Flyers",
// //     variantId: 8,
// //     variantName: "Recto",
// //     pricingMode: "RECTO_VERSO",
// //     config: { A3: 2400, A4: 1200 },
// //     weight: 3,
// //   },
// //   {
// //     productId: 6,
// //     productName: "Flyers",
// //     variantId: 9,
// //     variantName: "Recto Verso",
// //     pricingMode: "RECTO_VERSO",
// //     config: { A3: 3600, A4: 1800 },
// //     weight: 2,
// //   },
// //   {
// //     productId: 7,
// //     productName: "Rollup",
// //     variantId: 10,
// //     variantName: "Standard",
// //     pricingMode: "FIXED",
// //     config: { unit: 210000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 7,
// //     productName: "Rollup",
// //     variantId: 11,
// //     variantName: "Deluxe",
// //     pricingMode: "FIXED",
// //     config: { unit: 270000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 8,
// //     productName: "Oriflamme",
// //     variantId: 12,
// //     variantName: "Standard",
// //     pricingMode: "FIXED",
// //     config: { "2.8m": 200000, "3.5m": 240000, "4.5m": 300000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 9,
// //     productName: "Métrage DTF",
// //     variantId: 13,
// //     variantName: "Standard",
// //     pricingMode: "FORMAT",
// //     config: { A4: 10000, "1m*60cm": 22000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 10,
// //     productName: "T-Shirt Personnalisé",
// //     variantId: 14,
// //     variantName: "Marquage DTF",
// //     pricingMode: "FIXED",
// //     config: { unit: 21000 },
// //     weight: 2,
// //   },
// //   {
// //     productId: 10,
// //     productName: "T-Shirt Personnalisé",
// //     variantId: 15,
// //     variantName: "Marquage Flex",
// //     pricingMode: "FIXED",
// //     config: { unit: 28000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 11,
// //     productName: "Polo Personnalisé",
// //     variantId: 16,
// //     variantName: "Marquage DTF",
// //     pricingMode: "FIXED",
// //     config: { unit: 30000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 11,
// //     productName: "Polo Personnalisé",
// //     variantId: 17,
// //     variantName: "Marquage Flex",
// //     pricingMode: "FIXED",
// //     config: { unit: 38000 },
// //     weight: 1,
// //   },
// //   {
// //     productId: 12,
// //     productName: "Mug Souvenir",
// //     variantId: 18,
// //     variantName: "Standard",
// //     pricingMode: "FIXED",
// //     config: { unit: 14000 },
// //     weight: 2,
// //   },
// //   {
// //     productId: 13,
// //     productName: "Conception graphique",
// //     variantId: 19,
// //     variantName: "Standard",
// //     pricingMode: "PER_UNIT",
// //     config: { unit: 30000 },
// //     weight: 2,
// //   },
// //   {
// //     productId: 14,
// //     productName: "Impression",
// //     variantId: 20,
// //     variantName: "Standard",
// //     pricingMode: "FIXED",
// //     config: { unit: 100 },
// //     weight: 3,
// //   },
// // ];

// // // ============================================================
// // // CLIENTS FICTIFS
// // // ============================================================
// // const CLIENTS = [
// //   {
// //     firstName: "Rakoto",
// //     lastName: "Andriamasy",
// //     email: "rakoto.andriamasy@mail.mg",
// //     phone: "034 12 345 67",
// //     address: "Lot II M 45, Antananarivo",
// //   },
// //   {
// //     firstName: "Rasoa",
// //     lastName: "Ravelo",
// //     email: "rasoa.ravelo@mail.mg",
// //     phone: "033 22 456 78",
// //     address: "Lot III A 12, Antananarivo",
// //   },
// //   {
// //     firstName: "Jean",
// //     lastName: "Rakotondrabe",
// //     email: "jean.rakotondrabe@mail.mg",
// //     phone: "032 33 567 89",
// //     address: "Villa Rose, Ivato",
// //   },
// //   {
// //     firstName: "Hery",
// //     lastName: "Randriamanana",
// //     email: "hery.randriamanana@mail.mg",
// //     phone: "034 44 678 90",
// //     address: "Lot 45 Bis, Analakely",
// //   },
// //   {
// //     firstName: "Fanja",
// //     lastName: "Rasoanaivo",
// //     email: "fanja.rasoanaivo@mail.mg",
// //     phone: "033 55 789 01",
// //     address: "Immeuble Soa, Antsahavola",
// //   },
// //   {
// //     firstName: "Tojo",
// //     lastName: "Rabe",
// //     email: "tojo.rabe@mail.mg",
// //     phone: "032 66 890 12",
// //     address: "Lot 78, Ambohipo",
// //   },
// //   {
// //     firstName: "Miora",
// //     lastName: "Rakotomalala",
// //     email: "miora.rakotomalala@mail.mg",
// //     phone: "034 77 901 23",
// //     address: "Lot IV B 5, Tsaralalàna",
// //   },
// //   {
// //     firstName: "Andry",
// //     lastName: "Ratsimba",
// //     email: "andry.ratsimba@mail.mg",
// //     phone: "033 88 012 34",
// //     address: "Lot 12, Ankorondrano",
// //   },
// //   {
// //     firstName: "Lalao",
// //     lastName: "Randrianasolo",
// //     email: "lalao.randrianasolo@mail.mg",
// //     phone: "032 99 123 45",
// //     address: "Lot 34, Itaosy",
// //   },
// //   {
// //     firstName: "Fara",
// //     lastName: "Rakotobe",
// //     email: "fara.rakotobe@mail.mg",
// //     phone: "034 10 234 56",
// //     address: "Lot 56, Ambohimanarina",
// //   },
// //   {
// //     firstName: "Tiana",
// //     lastName: "Andrianjaka",
// //     email: "tiana.andrianjaka@mail.mg",
// //     phone: "033 11 345 67",
// //     address: "Lot 78, Alasora",
// //   },
// //   {
// //     firstName: "Naina",
// //     lastName: "Razafindrakoto",
// //     email: "naina.razafindrakoto@mail.mg",
// //     phone: "032 12 456 78",
// //     address: "Lot 90, Ankadifotsy",
// //   },
// //   {
// //     firstName: "Voahangy",
// //     lastName: "Rakotonirina",
// //     email: "voahangy.rakotonirina@mail.mg",
// //     phone: "034 13 567 89",
// //     address: "Lot 23, Ambatoroka",
// //   },
// //   {
// //     firstName: "Solo",
// //     lastName: "Ramanantsoa",
// //     email: "solo.ramanantsoa@mail.mg",
// //     phone: "033 14 678 90",
// //     address: "Lot 45, Ampasapito",
// //   },
// //   {
// //     firstName: "Harisoa",
// //     lastName: "Ranaivoson",
// //     email: "harisoa.ranaivoson@mail.mg",
// //     phone: "032 15 789 01",
// //     address: "Lot 67, Andravoahangy",
// //   },
// //   {
// //     firstName: "Fenosoa",
// //     lastName: "Rakotonarivo",
// //     email: "fenosoa.rakotonarivo@mail.mg",
// //     phone: "034 16 890 12",
// //     address: "Lot 89, Mahamasina",
// //   },
// //   {
// //     firstName: "Mamy",
// //     lastName: "Rajaonarison",
// //     email: "mamy.rajaonarison@mail.mg",
// //     phone: "033 17 901 23",
// //     address: "Lot 11, Isoraka",
// //   },
// //   {
// //     firstName: "Voary",
// //     lastName: "Ravelomanana",
// //     email: "voary.ravelomanana@mail.mg",
// //     phone: "032 18 012 34",
// //     address: "Lot 33, Ambohijatovo",
// //   },
// //   {
// //     firstName: "Rado",
// //     lastName: "Randrianarison",
// //     email: "rado.randrianarison@mail.mg",
// //     phone: "034 19 123 45",
// //     address: "Lot 55, Analamahitsy",
// //   },
// //   {
// //     firstName: "Fanja",
// //     lastName: "Rakotozafy",
// //     email: "fanja.rakotozafy@mail.mg",
// //     phone: "033 20 234 56",
// //     address: "Lot 77, Ivandry",
// //   },
// // ];

// // // ============================================================
// // // PRNG DÉTERMINISTE
// // // ============================================================
// // const makeRng = (seed: number) => {
// //   let s = seed >>> 0;
// //   return () => {
// //     s = (s + 0x6d2b79f5) >>> 0;
// //     let t = s;
// //     t = Math.imul(t ^ (t >>> 15), t | 1);
// //     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
// //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// //   };
// // };

// // const rng = makeRng(20261109);

// // const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
// // const randInt = (min: number, max: number): number =>
// //   Math.floor(rng() * (max - min + 1)) + min;

// // // Tirage pondéré du catalogue
// // const pickWeightedCatalog = (): CatalogEntry => {
// //   const totalWeight = CATALOG.reduce((sum, e) => sum + e.weight, 0);
// //   let r = rng() * totalWeight;
// //   for (const entry of CATALOG) {
// //     r -= entry.weight;
// //     if (r <= 0) return entry;
// //   }
// //   return CATALOG[0];
// // };

// // // ============================================================
// // // UTILITAIRES
// // // ============================================================
// // const pad = (n: number, len = 3): string => String(n).padStart(len, "0");

// // const buildReference = (prefix: string, date: Date, seq: number): string => {
// //   const y = date.getFullYear();
// //   const m = String(date.getMonth() + 1).padStart(2, "0");
// //   return `${prefix}-${y}-${m}-${pad(seq)}`;
// // };

// // const buildOrderReference = (date: Date, seq: number): string =>
// //   `CMD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${pad(seq)}`;

// // // Quantités réduites, paniers modestes
// // const buildOrderLine = (entry: CatalogEntry) => {
// //   const { pricingMode, config } = entry;

// //   if (pricingMode === "FIXED") {
// //     const qty = randInt(1, 3);
// //     const priceKey = Object.keys(config)[0];
// //     return {
// //       unitPrice: config[priceKey],
// //       quantity: qty,
// //       dimensions: null as string | null,
// //       label: entry.variantName,
// //     };
// //   }

// //   if (pricingMode === "PER_M2") {
// //     const qty = randInt(1, 4);
// //     return {
// //       unitPrice: config.per_m2,
// //       quantity: qty,
// //       dimensions: `${qty} m²`,
// //       label: entry.variantName,
// //     };
// //   }

// //   if (pricingMode === "PER_UNIT") {
// //     const qty = randInt(100, 500);
// //     return {
// //       unitPrice: config.unit,
// //       quantity: qty,
// //       dimensions: null as string | null,
// //       label: entry.variantName,
// //     };
// //   }

// //   if (pricingMode === "FORMAT") {
// //     const formats = Object.keys(config).filter((k) => k !== "max");
// //     const format = pick(formats);
// //     const qty = randInt(1, 10);
// //     return {
// //       unitPrice: config[format],
// //       quantity: qty,
// //       dimensions: format,
// //       label: `${entry.variantName} ${format}`,
// //     };
// //   }

// //   if (pricingMode === "RECTO_VERSO") {
// //     const formats = Object.keys(config);
// //     const format = pick(formats);
// //     const qty = randInt(100, 500);
// //     return {
// //       unitPrice: config[format],
// //       quantity: qty,
// //       dimensions: format,
// //       label: `${entry.variantName} ${format}`,
// //     };
// //   }

// //   // COMPOSITE
// //   const qty = randInt(1, 10);
// //   return {
// //     unitPrice: config.A4,
// //     quantity: qty,
// //     dimensions: "A4",
// //     label: `${entry.variantName} A4`,
// //   };
// // };

// // const pickOrderStatus = (): string => {
// //   const r = rng();
// //   if (r < 0.3) return "waiting_for_file";
// //   if (r < 0.45) return "in_progress";
// //   if (r < 0.55) return "file_completed";
// //   if (r < 0.7) return "printing_in_progress";
// //   if (r < 0.8) return "cutting_in_progress";
// //   if (r < 0.9) return "ready_for_delivery";
// //   if (r < 0.98) return "delivered";
// //   return "cancelled";
// // };

// // // ============================================================
// // // MAIN
// // // ============================================================
// // const main = async () => {
// //   console.log("🌱 Seed sales start...\n");

// //   const now = new Date();
// //   const todayEnd = new Date(
// //     now.getFullYear(),
// //     now.getMonth(),
// //     now.getDate(),
// //     23,
// //     59,
// //     59,
// //   );

// //   // Juillet → aujourd'hui (5 mois calendaires dont novembre partiel)
// //   const startPeriod = new Date(
// //     now.getFullYear(),
// //     now.getMonth() - 4,
// //     1,
// //     8,
// //     0,
// //     0,
// //   );

// //   // Jours ouvrés de la période
// //   const allDates: Date[] = [];
// //   const cursor = new Date(startPeriod);
// //   while (cursor <= todayEnd) {
// //     const day = cursor.getDay();
// //     if (day !== 0 && day !== 6) allDates.push(new Date(cursor));
// //     cursor.setDate(cursor.getDate() + 1);
// //   }

// //   // 3 dates par semaine (lun-ven)
// //   const invoiceDates: Date[] = [];
// //   let weekBucket: Date[] = [];
// //   for (const d of allDates) {
// //     weekBucket.push(d);
// //     if (weekBucket.length === 5) {
// //       const shuffled = [...weekBucket].sort(() => rng() - 0.5);
// //       invoiceDates.push(shuffled[0], shuffled[1], shuffled[2]);
// //       weekBucket = [];
// //     }
// //   }
// //   if (weekBucket.length > 0) {
// //     const count = Math.min(3, weekBucket.length);
// //     const shuffled = [...weekBucket].sort(() => rng() - 0.5);
// //     for (let i = 0; i < count; i++) invoiceDates.push(shuffled[i]);
// //   }
// //   invoiceDates.sort((a, b) => a.getTime() - b.getTime());

// //   // 1. Clients
// //   const createdClients = [];
// //   for (const c of CLIENTS) {
// //     const client = await prisma.client.create({
// //       data: {
// //         id: randomUUID(),
// //         firstName: c.firstName,
// //         lastName: c.lastName,
// //         email: c.email,
// //         phone: c.phone,
// //         address: c.address,
// //       },
// //     });
// //     createdClients.push(client);
// //   }
// //   console.log(`✓ ${createdClients.length} clients créés`);

// //   // Compteurs de séquence
// //   const invoiceSeqByMonth = new Map<string, number>();
// //   const quoteSeqByMonth = new Map<string, number>();
// //   const incSeq = (map: Map<string, number>, key: string): number => {
// //     const next = (map.get(key) ?? 0) + 1;
// //     map.set(key, next);
// //     return next;
// //   };
// //   const monthKey = (d: Date): string =>
// //     `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

// //   let totalInvoices = 0;
// //   let totalOrders = 0;
// //   let totalPayments = 0;
// //   let totalLogs = 0;
// //   let totalQuotes = 0;
// //   let orderSeq = 0;

// //   // 2. Factures + commandes + paiements + logs
// //   for (const invoiceDate of invoiceDates) {
// //     const mk = monthKey(invoiceDate);
// //     const invSeq = incSeq(invoiceSeqByMonth, mk);
// //     const invoiceNumber = buildReference("F", invoiceDate, invSeq);
// //     const client = pick(createdClients);
// //     const createdById = pick(SALES_IDS);

// //     // 1 à 2 commandes par facture
// //     const orderCount = randInt(1, 2);
// //     const orderLines = [];
// //     for (let i = 0; i < orderCount; i++) {
// //       const entry = pickWeightedCatalog();
// //       const line = buildOrderLine(entry);
// //       orderLines.push({ entry, line });
// //     }

// //     const total = orderLines.reduce(
// //       (sum, ol) => sum + ol.line.unitPrice * ol.line.quantity,
// //       0,
// //     );

// //     const r = rng();
// //     const paymentKind = r < 0.4 ? "paid" : r < 0.8 ? "partial" : "unpaid";

// //     let deposit = 0;
// //     let paymentStatus: string = "unpaid";
// //     let isDelivered = false;

// //     if (paymentKind === "paid") {
// //       deposit = total;
// //       paymentStatus = "paid";
// //       isDelivered = true;
// //     } else if (paymentKind === "partial") {
// //       deposit = Math.round(total * (0.3 + rng() * 0.4));
// //       paymentStatus = "partial";
// //     }

// //     const invoice = await prisma.invoice.create({
// //       data: {
// //         number: invoiceNumber,
// //         date: invoiceDate,
// //         clientId: client.id,
// //         total,
// //         deposit,
// //         paymentStatus,
// //         isDelivered,
// //         companyInfoId: COMPANY_INFO_ID,
// //         createdById,
// //         createdAt: invoiceDate,
// //         updatedAt: invoiceDate,
// //       },
// //     });
// //     totalInvoices++;

// //     for (const { entry, line } of orderLines) {
// //       orderSeq++;
// //       await prisma.order.create({
// //         data: {
// //           reference: buildOrderReference(invoiceDate, orderSeq),
// //           designation: entry.productName,
// //           label: line.label,
// //           dimensions: line.dimensions,
// //           clientId: client.id,
// //           productId: entry.productId,
// //           unitPrice: line.unitPrice,
// //           quantity: line.quantity,
// //           status: pickOrderStatus(),
// //           invoiceId: invoice.id,
// //           createdById,
// //           createdAt: invoiceDate,
// //           updatedAt: invoiceDate,
// //         },
// //       });
// //       totalOrders++;
// //     }

// //     if (deposit > 0) {
// //       const paymentDate = new Date(invoiceDate.getTime() + 86400000);
// //       const payment = await prisma.payment.create({
// //         data: {
// //           invoiceId: invoice.id,
// //           amount: deposit,
// //           method: pick(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CHECK"]),
// //           reference: null,
// //           date: paymentDate,
// //           receivedById: createdById,
// //         },
// //       });
// //       totalPayments++;

// //       await prisma.paymentAuditLog.create({
// //         data: {
// //           action: "CREATE",
// //           paymentId: payment.id,
// //           userId: createdById,
// //           oldData: undefined,
// //           newData: {
// //             id: payment.id,
// //             date: paymentDate.toISOString(),
// //             amount: deposit,
// //             method: payment.method,
// //             reference: null,
// //             invoice: { id: invoice.id, number: invoice.number },
// //             receivedById: createdById,
// //           },
// //           createdAt: paymentDate,
// //         },
// //       });
// //       totalLogs++;
// //     }
// //   }

// //   // 3. Devis (3 par mois, ~15 total)
// //   for (let i = 0; i < 15; i++) {
// //     const quoteDate = pick(invoiceDates);
// //     const mk = monthKey(quoteDate);
// //     const qSeq = incSeq(quoteSeqByMonth, mk);
// //     const number = buildReference("D", quoteDate, qSeq);
// //     const client = pick(createdClients);
// //     const createdById = pick(SALES_IDS);

// //     const orderCount = randInt(1, 2);
// //     const orderLines = [];
// //     for (let j = 0; j < orderCount; j++) {
// //       const entry = pickWeightedCatalog();
// //       const line = buildOrderLine(entry);
// //       orderLines.push({ entry, line });
// //     }
// //     const total = orderLines.reduce(
// //       (sum, ol) => sum + ol.line.unitPrice * ol.line.quantity,
// //       0,
// //     );

// //     const status = rng() < 0.3 ? "converted" : "pending";

// //     await prisma.quote.create({
// //       data: {
// //         number,
// //         date: quoteDate,
// //         clientId: client.id,
// //         total,
// //         status,
// //         companyInfoId: COMPANY_INFO_ID,
// //         createdById,
// //         createdAt: quoteDate,
// //         updatedAt: quoteDate,
// //       },
// //     });
// //     totalQuotes++;
// //   }

// //   // 4. Paiements supprimés (audit DELETE) — 5 au total
// //   const paymentsForDeletion = await prisma.payment.findMany({
// //     take: 5,
// //     orderBy: { date: "desc" },
// //     include: { invoice: { select: { id: true, number: true } } },
// //   });

// //   for (const p of paymentsForDeletion) {
// //     await prisma.payment.update({
// //       where: { id: p.id },
// //       data: { deletedAt: new Date() },
// //     });
// //     const inv = await prisma.invoice.findUnique({ where: { id: p.invoiceId } });
// //     if (inv) {
// //       const newDeposit = Math.max(0, inv.deposit - p.amount);
// //       await prisma.invoice.update({
// //         where: { id: inv.id },
// //         data: {
// //           deposit: newDeposit,
// //           paymentStatus:
// //             newDeposit >= inv.total
// //               ? "paid"
// //               : newDeposit > 0
// //                 ? "partial"
// //                 : "unpaid",
// //         },
// //       });
// //     }
// //     await prisma.paymentAuditLog.create({
// //       data: {
// //         action: "DELETE",
// //         paymentId: p.id,
// //         userId: ADMIN_ID,
// //         oldData: {
// //           id: p.id,
// //           amount: p.amount,
// //           method: p.method,
// //           date: p.date.toISOString(),
// //           invoice: { id: p.invoice.id, number: p.invoice.number },
// //         },
// //         newData: undefined,
// //         reason: "Correction de saisie",
// //         createdAt: new Date(),
// //       },
// //     });
// //     totalLogs++;
// //   }

// //   console.log(`✓ ${totalInvoices} factures créées`);
// //   console.log(`✓ ${totalOrders} commandes créées`);
// //   console.log(`✓ ${totalPayments} paiements créés`);
// //   console.log(`✓ ${totalQuotes} devis créés`);
// //   console.log(`✓ ${totalLogs} logs d'audit créés`);
// //   console.log("\n✅ Seed sales terminé\n");
// // };

// // main()
// //   .catch((e) => {
// //     console.error("❌ Seed échoué :", e);
// //     process.exit(1);
// //   })
// //   .finally(async () => {
// //     await prisma.$disconnect();
// //     await pool.end();
// //   });
// import "dotenv/config";
// import { PrismaClient } from "../generated/prisma/client.js";
// import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";

// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error("DATABASE_URL manquant dans .env");
// }
// const pool = new pg.Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// // ============================================================
// // IDs FIXES
// // ============================================================
// const COMPANY_INFO_ID = 36;

// const SALES_IDS = [
//   "019e549a-e705-71fa-b978-17de481e68d8",
//   "019e3ef9-710b-777c-83d0-3f4644383d25",
//   "019e3ef9-710b-777c-83d0-3f4644383d24",
//   "019e3ef9-710b-777c-83d0-3f4644383d23",
//   "019e3ef9-710b-777c-83d0-3f4644383d22",
//   "019e3ef9-710b-777c-83d0-3f4644383d21",
// ];

// // ============================================================
// // CATALOGUE (mêmes poids que le seed principal)
// // ============================================================
// type CatalogEntry = {
//   productId: number;
//   productName: string;
//   variantName: string;
//   pricingMode: string;
//   config: Record<string, number>;
//   weight: number;
// };

// const CATALOG: CatalogEntry[] = [
//   {
//     productId: 1,
//     productName: "Vinyle Autocollant",
//     variantName: "Prédécoupé",
//     pricingMode: "COMPOSITE",
//     config: { A4: 2500, per_m2: 22000 },
//     weight: 3,
//   },
//   {
//     productId: 1,
//     productName: "Vinyle Autocollant",
//     variantName: "Sans Découpe",
//     pricingMode: "PER_M2",
//     config: { per_m2: 18000 },
//     weight: 2,
//   },
//   {
//     productId: 2,
//     productName: "Bâche publicitaire",
//     variantName: "Standard",
//     pricingMode: "PER_M2",
//     config: { per_m2: 18000 },
//     weight: 2,
//   },
//   {
//     productId: 3,
//     productName: "Panneau PVC",
//     variantName: "Standard",
//     pricingMode: "FORMAT",
//     config: { A1: 40000, A2: 22000, A3: 15000, A4: 10000, max: 72000 },
//     weight: 1,
//   },
//   {
//     productId: 4,
//     productName: "Papier Autocollant",
//     variantName: "Standard",
//     pricingMode: "FORMAT",
//     config: { A4: 2000 },
//     weight: 2,
//   },
//   {
//     productId: 5,
//     productName: "Carte de Visite",
//     variantName: "Recto Seul",
//     pricingMode: "PER_UNIT",
//     config: { unit: 150 },
//     weight: 4,
//   },
//   {
//     productId: 5,
//     productName: "Carte de Visite",
//     variantName: "Recto Verso",
//     pricingMode: "PER_UNIT",
//     config: { unit: 300 },
//     weight: 3,
//   },
//   {
//     productId: 6,
//     productName: "Flyers",
//     variantName: "Recto",
//     pricingMode: "RECTO_VERSO",
//     config: { A3: 2400, A4: 1200 },
//     weight: 3,
//   },
//   {
//     productId: 6,
//     productName: "Flyers",
//     variantName: "Recto Verso",
//     pricingMode: "RECTO_VERSO",
//     config: { A3: 3600, A4: 1800 },
//     weight: 2,
//   },
//   {
//     productId: 7,
//     productName: "Rollup",
//     variantName: "Standard",
//     pricingMode: "FIXED",
//     config: { unit: 210000 },
//     weight: 1,
//   },
//   {
//     productId: 7,
//     productName: "Rollup",
//     variantName: "Deluxe",
//     pricingMode: "FIXED",
//     config: { unit: 270000 },
//     weight: 1,
//   },
//   {
//     productId: 8,
//     productName: "Oriflamme",
//     variantName: "Standard",
//     pricingMode: "FIXED",
//     config: { "2.8m": 200000, "3.5m": 240000, "4.5m": 300000 },
//     weight: 1,
//   },
//   {
//     productId: 9,
//     productName: "Métrage DTF",
//     variantName: "Standard",
//     pricingMode: "FORMAT",
//     config: { A4: 10000, "1m*60cm": 22000 },
//     weight: 1,
//   },
//   {
//     productId: 10,
//     productName: "T-Shirt Personnalisé",
//     variantName: "Marquage DTF",
//     pricingMode: "FIXED",
//     config: { unit: 21000 },
//     weight: 2,
//   },
//   {
//     productId: 10,
//     productName: "T-Shirt Personnalisé",
//     variantName: "Marquage Flex",
//     pricingMode: "FIXED",
//     config: { unit: 28000 },
//     weight: 1,
//   },
//   {
//     productId: 11,
//     productName: "Polo Personnalisé",
//     variantName: "Marquage DTF",
//     pricingMode: "FIXED",
//     config: { unit: 30000 },
//     weight: 1,
//   },
//   {
//     productId: 11,
//     productName: "Polo Personnalisé",
//     variantName: "Marquage Flex",
//     pricingMode: "FIXED",
//     config: { unit: 38000 },
//     weight: 1,
//   },
//   {
//     productId: 12,
//     productName: "Mug Souvenir",
//     variantName: "Standard",
//     pricingMode: "FIXED",
//     config: { unit: 14000 },
//     weight: 2,
//   },
//   {
//     productId: 13,
//     productName: "Conception graphique",
//     variantName: "Standard",
//     pricingMode: "PER_UNIT",
//     config: { unit: 30000 },
//     weight: 2,
//   },
//   {
//     productId: 14,
//     productName: "Impression",
//     variantName: "Standard",
//     pricingMode: "FIXED",
//     config: { unit: 100 },
//     weight: 3,
//   },
// ];

// // ============================================================
// // PRNG DÉTERMINISTE (seed différente du seed principal)
// // ============================================================
// const makeRng = (seed: number) => {
//   let s = seed >>> 0;
//   return () => {
//     s = (s + 0x6d2b79f5) >>> 0;
//     let t = s;
//     t = Math.imul(t ^ (t >>> 15), t | 1);
//     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// };

// const rng = makeRng(20261110);

// const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
// const randInt = (min: number, max: number): number =>
//   Math.floor(rng() * (max - min + 1)) + min;

// const pickWeightedCatalog = (): CatalogEntry => {
//   const totalWeight = CATALOG.reduce((sum, e) => sum + e.weight, 0);
//   let r = rng() * totalWeight;
//   for (const entry of CATALOG) {
//     r -= entry.weight;
//     if (r <= 0) return entry;
//   }
//   return CATALOG[0];
// };

// // ============================================================
// // UTILITAIRES
// // ============================================================
// const pad = (n: number, len = 3): string => String(n).padStart(len, "0");

// const buildReference = (prefix: string, date: Date, seq: number): string => {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   return `${prefix}-${y}-${m}-${pad(seq)}`;
// };

// const buildOrderReference = (date: Date, seq: number): string =>
//   `CMD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${pad(seq)}`;

// const buildOrderLine = (entry: CatalogEntry) => {
//   const { pricingMode, config } = entry;

//   if (pricingMode === "FIXED") {
//     const qty = randInt(1, 3);
//     const priceKey = Object.keys(config)[0];
//     return {
//       unitPrice: config[priceKey],
//       quantity: qty,
//       dimensions: null as string | null,
//       label: entry.variantName,
//     };
//   }
//   if (pricingMode === "PER_M2") {
//     const qty = randInt(1, 4);
//     return {
//       unitPrice: config.per_m2,
//       quantity: qty,
//       dimensions: `${qty} m²`,
//       label: entry.variantName,
//     };
//   }
//   if (pricingMode === "PER_UNIT") {
//     const qty = randInt(100, 500);
//     return {
//       unitPrice: config.unit,
//       quantity: qty,
//       dimensions: null as string | null,
//       label: entry.variantName,
//     };
//   }
//   if (pricingMode === "FORMAT") {
//     const formats = Object.keys(config).filter((k) => k !== "max");
//     const format = pick(formats);
//     const qty = randInt(1, 10);
//     return {
//       unitPrice: config[format],
//       quantity: qty,
//       dimensions: format,
//       label: `${entry.variantName} ${format}`,
//     };
//   }
//   if (pricingMode === "RECTO_VERSO") {
//     const formats = Object.keys(config);
//     const format = pick(formats);
//     const qty = randInt(100, 500);
//     return {
//       unitPrice: config[format],
//       quantity: qty,
//       dimensions: format,
//       label: `${entry.variantName} ${format}`,
//     };
//   }
//   // COMPOSITE
//   const qty = randInt(1, 10);
//   return {
//     unitPrice: config.A4,
//     quantity: qty,
//     dimensions: "A4",
//     label: `${entry.variantName} A4`,
//   };
// };

// const pickOrderStatus = (): string => {
//   const r = rng();
//   if (r < 0.3) return "waiting_for_file";
//   if (r < 0.45) return "in_progress";
//   if (r < 0.55) return "file_completed";
//   if (r < 0.7) return "printing_in_progress";
//   if (r < 0.8) return "cutting_in_progress";
//   if (r < 0.9) return "ready_for_delivery";
//   if (r < 0.98) return "delivered";
//   return "cancelled";
// };

// // ============================================================
// // MAIN
// // ============================================================
// const main = async () => {
//   console.log("🌱 Seed novembre start...\n");

//   // Période : 1er novembre → 9 novembre 2026 (année courante)
//   const now = new Date();
//   const year = now.getFullYear();
//   const start = new Date(year, 10, 1, 8, 0, 0); // mois 10 = novembre (0-indexé)
//   const end = new Date(year, 10, 9, 23, 59, 59);

//   // Jours ouvrés du 1 au 9 novembre
//   const dates: Date[] = [];
//   const cursor = new Date(start);
//   while (cursor <= end) {
//     const day = cursor.getDay();
//     if (day !== 0 && day !== 6) dates.push(new Date(cursor));
//     cursor.setDate(cursor.getDate() + 1);
//   }

//   // On prend 3 dates dans ces jours ouvrés (3 factures pour la semaine)
//   const invoiceDates: Date[] = [];
//   const shuffled = [...dates].sort(() => rng() - 0.5);
//   const count = Math.min(3, shuffled.length);
//   for (let i = 0; i < count; i++) invoiceDates.push(shuffled[i]);
//   invoiceDates.sort((a, b) => a.getTime() - b.getTime());

//   // Récupérer les clients existants
//   const clients = await prisma.client.findMany({
//     where: { deletedAt: null },
//     select: { id: true },
//   });
//   if (clients.length === 0) {
//     throw new Error("Aucun client en base. Lance d'abord le seed principal.");
//   }
//   console.log(`✓ ${clients.length} clients disponibles`);

//   // Déterminer la séquence de départ pour novembre (reprendre après ce qui existe déjà)
//   const existingNovemberInvoices = await prisma.invoice.count({
//     where: {
//       date: { gte: start, lte: end },
//     },
//   });
//   let invoiceSeq = existingNovemberInvoices;

//   let orderSeq = 0;

//   let totalInvoices = 0;
//   let totalOrders = 0;
//   let totalPayments = 0;
//   let totalLogs = 0;

//   // Créer les factures
//   for (const invoiceDate of invoiceDates) {
//     invoiceSeq++;
//     const invoiceNumber = buildReference("F", invoiceDate, invoiceSeq);
//     const client = pick(clients);
//     const createdById = pick(SALES_IDS);

//     const orderCount = randInt(1, 2);
//     const orderLines = [];
//     for (let i = 0; i < orderCount; i++) {
//       const entry = pickWeightedCatalog();
//       const line = buildOrderLine(entry);
//       orderLines.push({ entry, line });
//     }

//     const total = orderLines.reduce(
//       (sum, ol) => sum + ol.line.unitPrice * ol.line.quantity,
//       0,
//     );

//     const r = rng();
//     const paymentKind = r < 0.4 ? "paid" : r < 0.8 ? "partial" : "unpaid";

//     let deposit = 0;
//     let paymentStatus: string = "unpaid";
//     let isDelivered = false;

//     if (paymentKind === "paid") {
//       deposit = total;
//       paymentStatus = "paid";
//       isDelivered = true;
//     } else if (paymentKind === "partial") {
//       deposit = Math.round(total * (0.3 + rng() * 0.4));
//       paymentStatus = "partial";
//     }

//     const invoice = await prisma.invoice.create({
//       data: {
//         number: invoiceNumber,
//         date: invoiceDate,
//         clientId: client.id,
//         total,
//         deposit,
//         paymentStatus,
//         isDelivered,
//         companyInfoId: COMPANY_INFO_ID,
//         createdById,
//         createdAt: invoiceDate,
//         updatedAt: invoiceDate,
//       },
//     });
//     totalInvoices++;

//     for (const { entry, line } of orderLines) {
//       orderSeq++;
//       await prisma.order.create({
//         data: {
//           reference: buildOrderReference(invoiceDate, orderSeq),
//           designation: entry.productName,
//           label: line.label,
//           dimensions: line.dimensions,
//           clientId: client.id,
//           productId: entry.productId,
//           unitPrice: line.unitPrice,
//           quantity: line.quantity,
//           status: pickOrderStatus(),
//           invoiceId: invoice.id,
//           createdById,
//           createdAt: invoiceDate,
//           updatedAt: invoiceDate,
//         },
//       });
//       totalOrders++;
//     }

//     if (deposit > 0) {
//       const paymentDate = new Date(invoiceDate.getTime() + 86400000);
//       const payment = await prisma.payment.create({
//         data: {
//           invoiceId: invoice.id,
//           amount: deposit,
//           method: pick(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CHECK"]),
//           reference: null,
//           date: paymentDate,
//           receivedById: createdById,
//         },
//       });
//       totalPayments++;

//       await prisma.paymentAuditLog.create({
//         data: {
//           action: "CREATE",
//           paymentId: payment.id,
//           userId: createdById,
//           oldData: undefined,
//           newData: {
//             id: payment.id,
//             date: paymentDate.toISOString(),
//             amount: deposit,
//             method: payment.method,
//             reference: null,
//             invoice: { id: invoice.id, number: invoice.number },
//             receivedById: createdById,
//           },
//           createdAt: paymentDate,
//         },
//       });
//       totalLogs++;
//     }
//   }

//   // 1 devis pour novembre
//   const quoteDate = pick(invoiceDates);
//   const existingQuotes = await prisma.quote.count({
//     where: { date: { gte: start, lte: end } },
//   });
//   const quoteNumber = buildReference("D", quoteDate, existingQuotes + 1);
//   const client = pick(clients);
//   const createdById = pick(SALES_IDS);

//   const qOrderCount = randInt(1, 2);
//   const qLines = [];
//   for (let j = 0; j < qOrderCount; j++) {
//     const entry = pickWeightedCatalog();
//     const line = buildOrderLine(entry);
//     qLines.push({ entry, line });
//   }
//   const qTotal = qLines.reduce(
//     (sum, ol) => sum + ol.line.unitPrice * ol.line.quantity,
//     0,
//   );

//   await prisma.quote.create({
//     data: {
//       number: quoteNumber,
//       date: quoteDate,
//       clientId: client.id,
//       total: qTotal,
//       status: rng() < 0.3 ? "converted" : "pending",
//       companyInfoId: COMPANY_INFO_ID,
//       createdById,
//       createdAt: quoteDate,
//       updatedAt: quoteDate,
//     },
//   });

//   console.log(`✓ ${totalInvoices} factures créées`);
//   console.log(`✓ ${totalOrders} commandes créées`);
//   console.log(`✓ ${totalPayments} paiements créés`);
//   console.log(`✓ 1 devis créé`);
//   console.log(`✓ ${totalLogs} logs d'audit créés`);
//   console.log("\n✅ Seed novembre terminé\n");
// };

// main()
//   .catch((e) => {
//     console.error("❌ Seed échoué :", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//     await pool.end();
//   });

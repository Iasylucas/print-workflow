import { z } from "zod";
import type { ToolDefinition } from "./assistant.types.js";
import { prisma } from "@/config/prisma.js";
// ⚠️ Adapte cet import à ta façon d'accéder à Prisma dans AssistantRepository

/**
 * Nouveaux tools "métier" : ils font les jointures que le LLM ne peut pas faire
 * tout seul (facture -> commandes -> paiements) et renvoient des TOTAUX calculés
 * côté serveur (jamais comptés par le modèle).
 *
 * Utilisation dans assistant.tools.ts :
 *   import { extraTools } from "./assistant.tools.extra.js";
 *   export const assistantTools: ToolDefinition[] = [ ...tools existants, ...extraTools ];
 *
 * ⚠️ Reste à payer : ici = total - somme des paiements (non supprimés).
 * Si ton champ `deposit` N'est PAS déjà enregistré comme un Payment, utilise
 * `total - deposit - paidPayments`. Vérifie selon ta logique métier.
 */

const orderSelect = {
  id: true,
  reference: true,
  designation: true,
  dimensions: true,
  quantity: true,
  unitPrice: true,
  status: true,
} as const;

const toInvoiceView = (inv: any) => {
  const paidPayments = (inv.payments ?? []).reduce(
    (s: number, p: any) => s + p.amount,
    0,
  );
  return {
    number: inv.number,
    date: inv.date,
    client: inv.client
      ? {
          id: inv.client.id,
          name: [inv.client.firstName, inv.client.lastName]
            .filter(Boolean)
            .join(" "),
          phone: inv.client.phone,
        }
      : null,
    total: inv.total,
    deposit: inv.deposit,
    paidPayments,
    remaining: Math.max(0, inv.total - paidPayments),
    paymentStatus: inv.paymentStatus,
    isDelivered: inv.isDelivered,
    expectedDeliveryDate: inv.expectedDeliveryDate,
    deliveryPlace: inv.deliveryPlace,
    orders: (inv.orders ?? []).map((o: any) => ({
      reference: o.reference,
      designation: o.designation,
      dimensions: o.dimensions,
      quantity: o.quantity,
      unitPrice: o.unitPrice,
      lineTotal: o.unitPrice * o.quantity,
      status: o.status,
    })),
    payments: (inv.payments ?? []).map((p: any) => ({
      amount: p.amount,
      method: p.method,
      reference: p.reference,
      date: p.date,
    })),
  };
};

export const extraTools: ToolDefinition[] = [
  // === FACTURES + COMMANDES (la demande qui bloquait) ===
  {
    name: "getInvoicesWithOrders",
    description:
      "Liste les factures (impayées, partielles ou les deux) AVEC leurs commandes, paiements et le reste à payer. " +
      "À utiliser pour 'factures impayées et leurs commandes'. Aucun filtre requis : sans paramètre = impayées + partielles.",
    parameters: z.object({
      status: z
        .enum(["unpaid", "partial", "paid", "unpaid_or_partial"])
        .default("unpaid_or_partial"),
      clientId: z.string().uuid().optional(),
      isDelivered: z.boolean().optional(),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
      limit: z.coerce.number().int().positive().max(50).default(25),
    }),
    execute: async (args: Record<string, unknown>) => {
      const status = (args["status"] as string) ?? "unpaid_or_partial";
      const where: any = { deletedAt: null };
      if (status === "unpaid_or_partial")
        where.paymentStatus = { in: ["unpaid", "partial"] };
      else where.paymentStatus = status;
      if (args["clientId"]) where.clientId = args["clientId"];
      if (typeof args["isDelivered"] === "boolean")
        where.isDelivered = args["isDelivered"];
      if (args["startDate"] || args["endDate"]) {
        where.createdAt = {
          ...(args["startDate"]
            ? { gte: new Date(args["startDate"] as string) }
            : {}),
          ...(args["endDate"]
            ? { lte: new Date(args["endDate"] as string) }
            : {}),
        };
      }

      const limit = (args["limit"] as number) ?? 25;
      const [total, invoices] = await Promise.all([
        prisma.invoice.count({ where }),
        prisma.invoice.findMany({
          where,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
            orders: { where: { deletedAt: null }, select: orderSelect },
            payments: {
              where: { deletedAt: null },
              select: {
                amount: true,
                method: true,
                reference: true,
                date: true,
              },
            },
          },
        }),
      ]);

      const views = invoices.map(toInvoiceView);
      return {
        totalInvoices: total,
        returned: views.length,
        truncated: total > views.length,
        sumTotal: views.reduce((s, v) => s + v.total, 0),
        sumRemaining: views.reduce((s, v) => s + v.remaining, 0),
        invoices: views,
      };
    },
  },
  {
    name: "getInvoiceDetails",
    description:
      "Détail complet d'une facture par son numéro (ex: F-2026-11-001) : client, commandes, paiements, reste à payer.",
    parameters: z.object({ number: z.string().trim().min(1) }),
    execute: async (args: Record<string, unknown>) => {
      const inv = await prisma.invoice.findFirst({
        where: {
          number: { equals: args["number"] as string, mode: "insensitive" },
          deletedAt: null,
        },
        include: {
          client: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
          orders: { where: { deletedAt: null }, select: orderSelect },
          payments: {
            where: { deletedAt: null },
            select: { amount: true, method: true, reference: true, date: true },
          },
        },
      });
      if (!inv) return { found: false, number: args["number"] };
      return toInvoiceView(inv);
    },
  },

  // === PRODUCTION ===
  {
    name: "getOrdersCountByStatus",
    description:
      "Nombre de commandes par statut (vue d'ensemble de la production). Filtre optionnel par client ou période.",
    parameters: z.object({
      clientId: z.string().uuid().optional(),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const where: any = { deletedAt: null };
      if (args["clientId"]) where.clientId = args["clientId"];
      if (args["startDate"] || args["endDate"]) {
        where.createdAt = {
          ...(args["startDate"]
            ? { gte: new Date(args["startDate"] as string) }
            : {}),
          ...(args["endDate"]
            ? { lte: new Date(args["endDate"] as string) }
            : {}),
        };
      }
      const groups = await prisma.order.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
      });
      const byStatus = Object.fromEntries(
        groups.map((g) => [g.status, g._count._all]),
      );
      return { total: groups.reduce((s, g) => s + g._count._all, 0), byStatus };
    },
  },

  // === FINANCE ===
  {
    name: "getFinancialSummary",
    description:
      "Synthèse financière sur une période (défaut : tout) : nombre de factures par statut, total facturé, total encaissé, reste à encaisser.",
    parameters: z.object({
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const dateFilter =
        args["startDate"] || args["endDate"]
          ? {
              ...(args["startDate"]
                ? { gte: new Date(args["startDate"] as string) }
                : {}),
              ...(args["endDate"]
                ? { lte: new Date(args["endDate"] as string) }
                : {}),
            }
          : undefined;

      const invoices = await prisma.invoice.findMany({
        where: {
          deletedAt: null,
          ...(dateFilter ? { createdAt: dateFilter } : {}),
        },
        select: {
          total: true,
          paymentStatus: true,
          payments: { where: { deletedAt: null }, select: { amount: true } },
        },
      });

      const byStatus: Record<string, { count: number; total: number }> = {};
      let billed = 0;
      let collected = 0;
      for (const inv of invoices) {
        const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
        billed += inv.total;
        collected += paid;
        const b = (byStatus[inv.paymentStatus] ??= { count: 0, total: 0 });
        b.count += 1;
        b.total += inv.total;
      }
      return {
        invoiceCount: invoices.length,
        totalBilled: billed,
        totalCollected: collected,
        totalRemaining: Math.max(0, billed - collected),
        byStatus,
      };
    },
  },
];

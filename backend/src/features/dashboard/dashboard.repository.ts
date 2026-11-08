import { prisma } from "@/config/prisma.js";
import {
  DashboardStatsOutput,
  PaymentsTrendOutput,
  PaymentsTrendPoint,
} from "./dashboard.types.js";

type RawTrendRow = {
  month: Date;
  total: number;
};

/**
 * Retourne le premier jour du mois à 00:00:00.000 pour une date donnée.
 */
const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

/**
 * Décale une date d'un nombre de mois (positif ou négatif) et la ramène
 * au premier jour du mois résultant à 00:00:00.000.
 */
const shiftMonth = (date: Date, months: number): Date => {
  return new Date(date.getFullYear(), date.getMonth() + months, 1, 0, 0, 0, 0);
};

/**
 * Convertit une date en clé "YYYY-MM".
 */
const toMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

/**
 * Libellé court en français pour l'axe X du graphique.
 * Ex: "2026-06" → "juin", "2026-07" → "juil."
 */
const formatMonthLabelFR = (date: Date): string => {
  const label = new Intl.DateTimeFormat("fr-FR", {
    month: "short",
  }).format(date);
  return label.replace(".", "");
};

export class DashboardRepository {
  async getStats(): Promise<DashboardStatsOutput> {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const startOfNextMonth = shiftMonth(startOfCurrentMonth, 1);
    const startOfPreviousMonth = shiftMonth(startOfCurrentMonth, -1);

    const [currentAgg, previousAgg, deletedCount] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          deletedAt: null,
          date: {
            gte: startOfCurrentMonth,
            lt: startOfNextMonth,
          },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          deletedAt: null,
          date: {
            gte: startOfPreviousMonth,
            lt: startOfCurrentMonth,
          },
        },
        _sum: { amount: true },
      }),
      prisma.paymentAuditLog.count({
        where: {
          action: "DELETE",
          createdAt: { gte: startOfCurrentMonth },
        },
      }),
    ]);

    const paymentsThisMonth = currentAgg._sum.amount ?? 0;
    const paymentsPreviousMonth = previousAgg._sum.amount ?? 0;

    const paymentsDeltaPercent =
      paymentsPreviousMonth === 0
        ? null
        : Math.round(
            ((paymentsThisMonth - paymentsPreviousMonth) /
              paymentsPreviousMonth) *
              100,
          );

    return {
      paymentsThisMonth,
      paymentsPreviousMonth,
      paymentsDeltaPercent,
      deletedPaymentsThisMonth: deletedCount,
    };
  }

  async getPaymentsTrend(): Promise<PaymentsTrendOutput> {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const startOfNextMonth = shiftMonth(startOfCurrentMonth, 1);
    const startOfTrend = shiftMonth(startOfCurrentMonth, -5);

    const rawRows = await prisma.$queryRaw<RawTrendRow[]>`
      SELECT DATE_TRUNC('month', "date") AS month, SUM("amount")::int AS total
      FROM "Payment"
      WHERE "deletedAt" IS NULL
        AND "date" >= ${startOfTrend}
        AND "date" < ${startOfNextMonth}
      GROUP BY DATE_TRUNC('month', "date")
      ORDER BY month ASC
    `;

    const totalsByMonth = new Map<string, number>();
    for (const row of rawRows) {
      totalsByMonth.set(toMonthKey(row.month), Number(row.total));
    }

    const data: PaymentsTrendPoint[] = [];
    for (let i = 0; i < 6; i++) {
      const monthDate = shiftMonth(startOfTrend, i);
      const key = toMonthKey(monthDate);
      data.push({
        month: key,
        label: formatMonthLabelFR(monthDate),
        total: totalsByMonth.get(key) ?? 0,
      });
    }

    return { data };
  }
}
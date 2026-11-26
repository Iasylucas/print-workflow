import { z } from "zod";
import type { ToolDefinition } from "./assistant.types.js";
import { prisma } from "@/config/prisma.js";
// ⚠️ Même import prisma que dans assistant.tools.extra.ts;

/**
 * Qui travaille sur quelle commande ?
 *
 * Le schéma n'a pas de champ "assigné à". On déduit les intervenants à partir de :
 *  - OrderStatusHistory.changedBy : qui a changé le statut
 *  - File.uploadedBy              : qui a téléversé des fichiers
 *  - Note.user                    : qui a écrit une note
 *
 * Utilisation dans assistant.tools.ts :
 *   import { actorTools } from "./assistant.tools.actors.js";
 *   ... , ...extraTools, ...actorTools ]
 */

const fullName = (
  u: {
    firstName: string | null;
    lastName: string | null;
    email?: string;
  } | null,
) =>
  u
    ? [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      u.email ||
      "Inconnu"
    : null;

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
} as const;

export const actorTools: ToolDefinition[] = [
  {
    name: "getOrdersWithActors",
    description:
      "Commandes (par statut) avec les personnes qui sont intervenues dessus : qui a changé leur statut, " +
      "qui a téléversé des fichiers, qui a écrit des notes, avec leur rôle (graphiste, imprimeur…). " +
      "À utiliser pour 'quels graphistes travaillent sur les commandes en cours', 'qui s'occupe de cette commande', " +
      "'qui a modifié la commande X'. Sans paramètre : toutes les commandes non livrées.",
    parameters: z.object({
      status: z
        .enum([
          "waiting_for_file",
          "in_progress",
          "file_completed",
          "printing_in_progress",
          "cutting_in_progress",
          "ready_for_delivery",
          "delivered",
        ])
        .optional(),
      role: z
        .enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER", "DELIVERER"])
        .optional(),
      reference: z.string().trim().optional(),
      limit: z.coerce.number().int().positive().max(50).default(30),
    }),
    execute: async (args: Record<string, unknown>) => {
      const where: any = { deletedAt: null };
      if (args["status"]) where.status = args["status"];
      else where.status = { not: "delivered" };
      if (args["reference"])
        where.reference = { equals: args["reference"], mode: "insensitive" };

      const limit = (args["limit"] as number) ?? 30;
      const roleFilter = args["role"] as string | undefined;

      const [total, orders] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
          where,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            client: { select: { firstName: true, lastName: true } },
            statusHistory: {
              orderBy: { createdAt: "desc" },
              take: 10,
              include: { changedBy: { select: userSelect } },
            },
            files: {
              select: {
                category: true,
                createdAt: true,
                uploadedBy: { select: userSelect },
              },
            },
            notes: {
              select: { createdAt: true, user: { select: userSelect } },
            },
          },
        }),
      ]);

      const result = orders.map((o) => {
        // Regroupe les actions par personne
        const people = new Map<
          string,
          { name: string | null; role: string; actions: Set<string> }
        >();
        const add = (u: any, action: string) => {
          if (!u) return;
          const entry = people.get(u.id) ?? {
            name: fullName(u),
            role: u.role,
            actions: new Set<string>(),
          };
          entry.actions.add(action);
          people.set(u.id, entry);
        };

        o.statusHistory.forEach((h) =>
          add(h.changedBy, `a mis la commande au statut ${h.toStatus}`),
        );
        o.files.forEach((f) =>
          add(f.uploadedBy, `a téléversé un fichier (${f.category})`),
        );
        o.notes.forEach((n) => add(n.user, "a ajouté une note"));

        let intervenants = [...people.values()].map((p) => ({
          name: p.name,
          role: p.role,
          actions: [...p.actions],
        }));
        if (roleFilter)
          intervenants = intervenants.filter((p) => p.role === roleFilter);

        const last = o.statusHistory[0];
        return {
          reference: o.reference,
          designation: o.designation,
          client: [o.client.firstName, o.client.lastName]
            .filter(Boolean)
            .join(" "),
          status: o.status,
          lastStatusChange: last
            ? {
                to: last.toStatus,
                by: fullName(last.changedBy),
                role: last.changedBy.role,
                at: last.createdAt,
              }
            : null,
          intervenants,
        };
      });

      return {
        totalOrders: total,
        returned: result.length,
        note: "Les intervenants sont déduits de l'historique de statuts, des fichiers et des notes (pas d'assignation explicite en base).",
        orders: roleFilter
          ? result.filter((r) => r.intervenants.length > 0)
          : result,
      };
    },
  },
];

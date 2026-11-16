import { z } from "zod";
import { AssistantRepository } from "./assistant.repository.js";
import type { ToolDefinition, OpenAIToolFormat } from "./assistant.types.js";

const repository = new AssistantRepository();

export const assistantTools: ToolDefinition[] = [
  {
    name: "countOrdersByStatus",
    description:
      "Compte le nombre de commandes ayant un statut donné. Statuts valides : waiting_for_file, in_progress, file_completed, printing_in_progress, cutting_in_progress, ready_for_delivery, delivered. Exclut les services (not_applicable).",
    parameters: z.object({
      status: z.enum([
        "waiting_for_file",
        "in_progress",
        "file_completed",
        "printing_in_progress",
        "cutting_in_progress",
        "ready_for_delivery",
        "delivered",
      ]),
    }),
    execute: async (args) => {
      const { status } = args as { status: string };
      const count = await repository.countOrdersByStatus(status);
      return { status, count };
    },
  },
  {
    name: "findOrderByReference",
    description:
      "Retrouve une commande par sa référence (ex: CMD-20261116-001). Retourne le statut actuel, le client, la désignation, la quantité, le prix, et la facture liée.",
    parameters: z.object({
      reference: z.string().trim().min(1),
    }),
    execute: async (args) => {
      const { reference } = args as { reference: string };
      const order = await repository.findOrderByReference(reference);
      if (!order) return { found: false, reference };
      return { found: true, order };
    },
  },
  {
    name: "getOrderStatusHistory",
    description:
      "Retourne l'historique des changements de statut d'une commande (20 plus récents). Chaque entrée contient la date, le statut d'origine, le nouveau statut, et le nom de la personne qui a fait le changement.",
    parameters: z.object({
      reference: z.string().trim().min(1),
    }),
    execute: async (args) => {
      const { reference } = args as { reference: string };
      const history = await repository.getOrderStatusHistory(reference);
      return { reference, history };
    },
  },
  {
    name: "getRevenueByMonth",
    description:
      "Retourne le total des encaissements (paiements) pour un mois et une année donnés. Utile pour les questions sur le chiffre d'affaires ou les encaissements.",
    parameters: z.object({
      month: z.number().int().min(1).max(12),
      year: z.number().int().min(2020).max(2100),
    }),
    execute: async (args) => {
      const { month, year } = args as { month: number; year: number };
      return await repository.getRevenueByMonth(month, year);
    },
  },
  {
    name: "getUnpaidInvoices",
    description:
      "Retourne un résumé des factures impayées ou partiellement payées : nombre, montant total facturé, montant déjà payé, reste à encaisser.",
    parameters: z.object({}),
    execute: async () => {
      return await repository.getUnpaidInvoices();
    },
  },
  {
    name: "getPendingQuotes",
    description:
      "Retourne le nombre et le montant total des devis en attente (statut pending).",
    parameters: z.object({}),
    execute: async () => {
      return await repository.getPendingQuotes();
    },
  },
  {
    name: "findInvoiceByNumber",
    description:
      "Retrouve une facture par son numéro (ex: F-2026-11-001). Retourne le total, l'acompte, le statut de paiement, la livraison, et le client.",
    parameters: z.object({
      number: z.string().trim().min(1),
    }),
    execute: async (args) => {
      const { number } = args as { number: string };
      const invoice = await repository.findInvoiceByNumber(number);
      if (!invoice) return { found: false, number };
      return { found: true, invoice };
    },
  },
  {
    name: "getUsersByRole",
    description:
      "Liste les utilisateurs actifs ayant un rôle donné. Rôles valides : ADMIN, SALES, PRINTER, GRAPHIC_DESIGNER.",
    parameters: z.object({
      role: z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]),
    }),
    execute: async (args) => {
      const { role } = args as { role: string };
      const users = await repository.getUsersByRole(role);
      return { role, users };
    },
  },
];

/**
 * Convertit les tools au format attendu par l'API OpenAI (Groq).
 */
export const getOpenAIToolsFormat = (): OpenAIToolFormat[] => {
  return assistantTools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: z.toJSONSchema(tool.parameters, {
        target: "draft-07",
        io: "input",
      }) as Record<string, unknown>,
    },
  }));
};
/**
 * Convertit un schéma Zod en JSON Schema (format OpenAI).
 * Supporte uniquement les types utilisés dans nos tools (object, string, number, enum).
 */
const zodToJsonSchema = (schema: z.ZodTypeAny): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const def = (schema as any)._def;

  if (!def) {
    return { type: "object", properties: {} };
  }

  // ZodObject
  if (def.typeName === "ZodObject") {
    const shape = def.shape();
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      const fieldSchema = value as z.ZodTypeAny;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldDef = (fieldSchema as any)._def;
      properties[key] = zodFieldToJsonSchema(fieldSchema);
      if (
        fieldDef?.typeName !== "ZodOptional" &&
        fieldDef?.typeName !== "ZodDefault"
      ) {
        required.push(key);
      }
    }

    return {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
    };
  }

  return zodFieldToJsonSchema(schema);
};

const zodFieldToJsonSchema = (
  schema: z.ZodTypeAny,
): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const def = (schema as any)._def;
  if (!def) return { type: "string" };

  switch (def.typeName) {
    case "ZodString":
      return { type: "string" };
    case "ZodNumber":
      return { type: "number" };
    case "ZodBoolean":
      return { type: "boolean" };
    case "ZodEnum":
      return { type: "string", enum: def.values };
    case "ZodOptional":
      return zodFieldToJsonSchema(def.innerType);
    case "ZodDefault":
      return zodFieldToJsonSchema(def.innerType);
    case "ZodArray":
      return {
        type: "array",
        items: zodFieldToJsonSchema(def.type),
      };
    case "ZodObject":
      return zodToJsonSchema(schema);
    default:
      return { type: "string" };
  }
};

/**
 * Exécute un tool par son nom.
 */
export const executeTool = async (
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> => {
  const tool = assistantTools.find((t) => t.name === name);
  if (!tool) {
    return { error: `Tool inconnu : ${name}` };
  }

  try {
    const validated = tool.parameters.parse(args);
    return await tool.execute(validated as Record<string, unknown>);
  } catch (error) {
    return {
      error: `Échec de l'exécution du tool ${name}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details: (error as any).message,
    };
  }
};

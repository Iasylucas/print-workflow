import { z } from "zod";
import { AssistantRepository } from "./assistant.repository.js";
import { InvoicesRepository } from "@/features/invoices/invoices.repository.js";
import { QuotesRepository } from "@/features/quotes/quotes.repository.js";
import { OrdersRepository } from "@/features/orders/orders.repository.js";
import { ClientRepository } from "@/features/client/client.repository.js";
import { ProductRepository } from "@/features/product/product.repository.js";
import { CompanyInfoRepository } from "@/features/company-info/company-info.repository.js";
import { OrderStatusHistoryRepository } from "@/features/order-status-history/order-status-history.repository.js";
import { PaymentAuditLogRepository } from "@/features/payment-audit-log/payment-audit-log.repository.js";
import { UserRepository } from "@/features/user/user.repository.js";
import type { ToolDefinition, OpenAIToolFormat } from "./assistant.types.js";

// Instantiation des repositories de features (lecture seule)
const invoicesRepository = new InvoicesRepository();
const quotesRepository = new QuotesRepository();
const ordersRepository = new OrdersRepository();
const clientRepository = new ClientRepository();
const productRepository = new ProductRepository();
const companyInfoRepository = new CompanyInfoRepository();
const orderStatusHistoryRepository = new OrderStatusHistoryRepository();
const paymentAuditLogRepository = new PaymentAuditLogRepository();
const userRepository = new UserRepository();

// Repository assistant pour les méthodes qui n'existent pas encore dans les feature repos
const assistantRepository = new AssistantRepository();

const repository = {
  invoices: invoicesRepository,
  quotes: quotesRepository,
  orders: ordersRepository,
  clients: clientRepository,
  products: productRepository,
  companyInfo: companyInfoRepository,
  orderStatusHistory: orderStatusHistoryRepository,
  paymentAuditLog: paymentAuditLogRepository,
  users: userRepository,
};

/**
 * Tools Assistant - 25 tools donnant un accès read complet à tous les repositories
 *
 * NOTE : Les fonctions execute reçoivent les args validés par Zod via executeTool,
 * mais le type est Record<string, unknown>. On utilise des accès par bracket
 * notation et des casts any là où nécessaire pour la compatibilité.
 */

export const assistantTools: ToolDefinition[] = [
  // === INVOICES ===
  {
    name: "getInvoicesList",
    description:
      "Liste des factures avec pagination, filtres (statut, non livrée, client), recherche et tri.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      status: z.enum(["unpaid", "partial", "paid"]).optional(),
      isDelivered: z.boolean().optional(),
      clientId: z.string().uuid().optional(),
      search: z.string().trim().optional(),
      sortBy: z
        .enum(["createdAt", "updatedAt", "number", "total", "clientId"])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await invoicesRepository.findAll({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        status: safe(args["status"]),
        isDelivered: safe(args["isDelivered"]),
        clientId: safe(args["clientId"]),
        search: safe(args["search"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "desc",
        startDate: safe(args["startDate"]),
        endDate: safe(args["endDate"]),
      });
    },
  },
  {
    name: "getInvoiceByNumber",
    description: "Retrouve une facture par son numéro (ex: F-2026-11-001).",
    parameters: z.object({
      number: z.string().trim().min(1, "Le numéro de facture est requis"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const number = args["number"] as string;
      if (!number) return { error: "Numéro de facture requis" };
      // Le repository findById prend un ID numérique, pas un numéro de facture
      // Pour l'instant, on redirige vers la recherche par liste
      return {
        note: "Utilisez getInvoicesList avec search pour trouver une facture par son numéro",
      };
    },
  },

  // === QUOTES ===
  {
    name: "getQuotesList",
    description:
      "Liste des devis avec pagination, filtres (status, client), recherche et tri.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      status: z.enum(["pending", "converted"]).optional(),
      clientId: z.string().uuid().optional(),
      search: z.string().trim().optional(),
      sortBy: z
        .enum([
          "createdAt",
          "updatedAt",
          "number",
          "total",
          "clientId",
          "status",
        ])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await quotesRepository.findAll({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        status: safe(args["status"]),
        clientId: safe(args["clientId"]),
        search: safe(args["search"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "desc",
        startDate: safe(args["startDate"]),
        endDate: safe(args["endDate"]),
      });
    },
  },
  {
    name: "getQuoteById",
    description: "Retrouve un devis par son ID.",
    parameters: z.object({
      id: z.coerce.number().int().positive("L'ID du devis est invalide"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const id = args["id"] as number;
      if (!id) return { error: "ID du devis requis" };
      return await quotesRepository.findById(id);
    },
  },

  // === ORDERS ===
  {
    name: "getOrdersList",
    description:
      "Liste des commandes avec pagination, filtres (status, client), recherche et tri.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
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
      clientId: z.string().uuid().optional(),
      search: z.string().trim().optional(),
      sortBy: z
        .enum(["createdAt", "updatedAt", "status", "designation", "clientId"])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await ordersRepository.findAll({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        status: safe(args["status"]),
        clientId: safe(args["clientId"]),
        search: safe(args["search"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "desc",
        startDate: safe(args["startDate"]),
        endDate: safe(args["endDate"]),
      });
    },
  },
  {
    name: "getOrderByReference",
    description:
      "Retrouve une commande par sa référence (ex: CMD-20261116-001).",
    parameters: z.object({
      reference: z
        .string()
        .trim()
        .min(1, "La référence de commande est requise"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const reference = args["reference"] as string;
      if (!reference) return { error: "Référence de commande requise" };
      return await assistantRepository.findOrderByReference(reference);
    },
  },

  // === CLIENTS ===
  {
    name: "getClientByEmail",
    description: "Trouve un client par son adresse email.",
    parameters: z.object({
      email: z.string().email("Email invalide"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const email = args["email"] as string;
      if (!email) return { error: "Email requis" };
      return await clientRepository.findByEmail(email);
    },
  },
  {
    name: "getClientById",
    description: "Trouve un client par son ID.",
    parameters: z.object({
      id: z.string().uuid(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const id = args["id"] as string;
      if (!id) return { error: "ID client requis" };
      return await clientRepository.findById(id);
    },
  },
  {
    name: "getClientsList",
    description: "Liste des clients avec pagination et filtres.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      search: z.string().trim().optional(),
      sortBy: z
        .enum(["createdAt", "lastName", "firstName"])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await clientRepository.findAll({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        search: safe(args["search"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "desc",
      });
    },
  },

  // === PRODUCTS ===
  {
    name: "getProductById",
    description: "Retrouve un produit par son ID.",
    parameters: z.object({
      id: z.coerce.number().int().positive("L'ID du produit est invalide"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const id = args["id"] as number;
      if (!id) return { error: "ID du produit requis" };
      return await productRepository.findById(id);
    },
  },
  {
    name: "getProductBySlug",
    description: "Retrouve un produit par son slug.",
    parameters: z.object({
      slug: z.string(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const slug = args["slug"] as string;
      if (!slug) return { error: "Slug du produit requis" };
      return await productRepository.findBySlug(slug);
    },
  },
  {
    name: "getProductsList",
    description: "Liste des produits avec pagination et recherche.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      search: z.string().trim().optional(),
      sortBy: z.enum(["createdAt", "name", "slug"]).default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await productRepository.findAll({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        search: safe(args["search"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "desc",
      });
    },
  },

  // === COMPANY INFO ===
  {
    name: "getCompanyInfo",
    description: "Récupère les informations de l'entreprise actuelles.",
    parameters: z.object({}),
    execute: async () => {
      return await companyInfoRepository.findActive();
    },
  },
  {
    name: "getCompanyInfoById",
    description: "Récupère les infos company par ID.",
    parameters: z.object({
      id: z.coerce
        .number()
        .int()
        .positive("L'ID des infos company est invalide"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const id = args["id"] as number;
      if (!id) return { error: "ID des infos company requis" };
      return await companyInfoRepository.findById(id);
    },
  },
  {
    name: "getCompanyInfoHistory",
    description: "Récupère l'historique des versions company info.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await companyInfoRepository.findAllVersions({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "desc",
        startDate: safe(args["startDate"]),
        endDate: safe(args["endDate"]),
      });
    },
  },

  // === ORDER STATUS HISTORY ===
  {
    name: "getOrderStatusHistoryList",
    description:
      "Liste de l'historique des changements de statut avec pagination et filtres.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      orderId: z.string().uuid().optional(),
      changedById: z.string().uuid().optional(),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await orderStatusHistoryRepository.findAll({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        orderId: safe(args["orderId"]),
        changedById: safe(args["changedById"]),
        startDate: safe(args["startDate"]),
        endDate: safe(args["endDate"]),
      });
    },
  },
  {
    name: "getOrderStatusByReference",
    description:
      "Retourne l'historique des changements de statut pour une commande par référence.",
    parameters: z.object({
      reference: z
        .string()
        .trim()
        .min(1, "La référence de commande est requise"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const reference = args["reference"] as string;
      if (!reference) return { error: "Référence de commande requise" };
      const order = await assistantRepository.findOrderByReference(reference);
      if (!order || !order.id)
        return { found: false, reference, error: "Commande introuvable" };
      return await orderStatusHistoryRepository.findByOrderId(order.id);
    },
  },

  // === PAYMENT AUDIT LOG ===
  {
    name: "getPaymentAuditList",
    description:
      "Liste de l'historique d'audit des paiements avec pagination et filtres.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      invoiceNumber: z.string().optional(),
      action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
      userId: z.string().uuid().optional(),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
      sortBy: z.enum(["createdAt"]).default("createdAt"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await paymentAuditLogRepository.findAll({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        invoiceNumber: safe(args["invoiceNumber"]),
        action: safe(args["action"]),
        userId: safe(args["userId"]),
        startDate: safe(args["startDate"]),
        endDate: safe(args["endDate"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "asc",
      });
    },
  },
  {
    name: "getAuditLogById",
    description: "Retrouve une entrée d'historique d'audit par ID.",
    parameters: z.object({
      id: z.string().uuid(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const id = args["id"] as string;
      if (!id) return { error: "ID de l'historique requis" };
      return await paymentAuditLogRepository.findById(id);
    },
  },
  {
    name: "getAuditByPaymentId",
    description: "Retourne l'historique d'audit pour un paiement donné.",
    parameters: z.object({
      paymentId: z.coerce
        .number()
        .int()
        .positive("L'ID du paiement est invalide"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const paymentId = args["paymentId"] as number;
      if (!paymentId) return { error: "ID du paiement requis" };
      return await paymentAuditLogRepository.getByPaymentId(paymentId);
    },
  },
  {
    name: "getAuditStats",
    description: "Retourne des statistiques sur l'historique d'audit.",
    parameters: z.object({
      invoiceNumber: z.string().optional(),
      action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
      userId: z.string().uuid().optional(),
      startDate: z.iso.datetime().optional(),
      endDate: z.iso.datetime().optional(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await paymentAuditLogRepository.getStats({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        invoiceNumber: safe(args["invoiceNumber"]),
        action: safe(args["action"]),
        userId: safe(args["userId"]),
        startDate: safe(args["startDate"]),
        endDate: safe(args["endDate"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "asc",
      });
    },
  },

  // === USERS (safe, no password) ===
  {
    name: "getUserById",
    description: "Retrouve un utilisateur par ID (sans mot de passe).",
    parameters: z.object({
      id: z.string().uuid(),
    }),
    execute: async (args: Record<string, unknown>) => {
      const id = args["id"] as string;
      if (!id) return { error: "ID utilisateur requis" };
      return await userRepository.findById(id);
    },
  },
  {
    name: "getUserByEmail",
    description: "Retrouve un utilisateur par email (sans mot de passe).",
    parameters: z.object({
      email: z.string().email("Email invalide"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const email = args["email"] as string;
      if (!email) return { error: "Email requis" };
      return await userRepository.findByEmail(email);
    },
  },
  {
    name: "getUsersList",
    description: "Liste des utilisateurs avec pagination et filtres.",
    parameters: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
      search: z.string().trim().optional(),
      isActive: z.boolean().optional(),
      role: z
        .enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"])
        .optional(),
      sortBy: z
        .enum(["createdAt", "email", "firstName", "lastName", "role"])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }),
    execute: async (args: Record<string, unknown>) => {
      const safe = (v: any) => (v !== undefined && v !== null ? v : undefined);
      return await userRepository.findAllPaginated({
        page: safe(args["page"]) || 1,
        limit: safe(args["limit"]) || 20,
        search: safe(args["search"]),
        isActive: safe(args["isActive"]),
        role: safe(args["role"]),
        sortBy: safe(args["sortBy"]) || "createdAt",
        sortOrder: safe(args["sortOrder"]) || "desc",
      });
    },
  },
  {
    name: "getUsersByRoles",
    description: "Liste des utilisateurs actifs par rôle.",
    parameters: z.object({
      role: z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]),
    }),
    execute: async (args: Record<string, unknown>) => {
      const role = args["role"] as string;
      if (!role) return { error: "Rôle requis" };
      return await userRepository.findActiveByRoles([role]);
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
 */
const zodToJsonSchema = (schema: z.ZodTypeAny): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const def = (schema as any)._def;

  if (!def) {
    return { type: "object", properties: {} };
  }

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
      details: (error as Error).message,
    };
  }
};

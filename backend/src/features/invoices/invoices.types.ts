// backend/src/features/invoices/invoices.types.ts
import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import {
  updateInvoiceSchema,
  markInvoiceDeliveredSchema,
  addPaymentSchema,
  updatePaymentSchema,
  invoicesQuerySchema,
  invoiceIdParamSchema,
} from "./invoices.schema.js";

// ============================================================
// 1. SÉLECTION POUR LA LISTE
// ============================================================
export const invoiceListSelect = {
  id: true,
  number: true,
  date: true,
  clientId: true,
  client: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  total: true,
  deposit: true,
  remaining: true,
  deliveryPlace: true,
  expectedDeliveryDate: true,
  isDelivered: true,
  paymentStatus: true,
  companyInfoId: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      orders: true,
      payments: true,
    },
  },
} satisfies Prisma.InvoiceSelect;

// ============================================================
// 2. SÉLECTION POUR LE DÉTAIL
// ============================================================
export const invoiceDetailSelect = {
  ...invoiceListSelect,
  companyInfo: {
    select: {
      nif: true,
      stat: true,
      mainAddress: true,
      secondaryAddress: true,
      logo: true,
      stamp: true,
      mobileMoneyNumbers: true,
      standardPhone: true,
      contactEmail: true,
      termsAndConditions: true,
      deliveryLeadTime: true,
      bankAccountHolder: true,
      bankBranch: true,
      bankCode: true,
      ribInfo: true,
    },
  },
  orders: {
    select: {
      id: true,
      reference: true,
      designation: true,
      label: true,
      dimensions: true,
      quantity: true,
      unitPrice: true,
      status: true,
      clientId: true,
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      files: {
        select: {
          id: true,
          url: true,
          category: true,
        },
      },
      notes: {
        select: {
          id: true,
          text: true,
          userId: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  },
  payments: {
    select: {
      id: true,
      amount: true,
      method: true,
      reference: true,
      date: true,
      receivedById: true,
      receivedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { date: "desc" },
  },
} satisfies Prisma.InvoiceSelect;

// ============================================================
// 3. TYPES INFÉRÉS
// ============================================================
export type InvoiceListOutput = Prisma.InvoiceGetPayload<{
  select: typeof invoiceListSelect;
}>;

export type InvoiceDetailOutput = Prisma.InvoiceGetPayload<{
  select: typeof invoiceDetailSelect;
}>;

export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type MarkInvoiceDeliveredInput = z.infer<
  typeof markInvoiceDeliveredSchema
>;
export type AddPaymentInput = z.infer<typeof addPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type InvoicesQuery = z.infer<typeof invoicesQuerySchema>;

// ============================================================
// 4. STRUCTURE PAGINÉE
// ============================================================
export type PaginatedInvoicesList = {
  data: InvoiceListOutput[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    status?: string;
    clientId?: string;
    isDelivered?: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
};

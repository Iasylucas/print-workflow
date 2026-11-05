import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import {
  updateQuoteSchema,
  quotesQuerySchema,
  quoteIdParamSchema,
} from "./quotes.schema.js";

export const quoteListSelect = {
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
  status: true,
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
    },
  },
} satisfies Prisma.QuoteSelect;

export const quoteDetailSelect = {
  ...quoteListSelect,
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
    where: { deletedAt: null },
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
      productId: true,
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
} satisfies Prisma.QuoteSelect;

export type QuoteListOutput = Prisma.QuoteGetPayload<{
  select: typeof quoteListSelect;
}>;

export type QuoteDetailOutput = Prisma.QuoteGetPayload<{
  select: typeof quoteDetailSelect;
}>;

export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type QuotesQuery = z.infer<typeof quotesQuerySchema>;

export type PaginatedQuotesList = {
  data: QuoteListOutput[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    status?: string;
    clientId?: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
};

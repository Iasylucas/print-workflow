// backend/src/features/quotes/quotes.repository.ts
import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  quoteListSelect,
  quoteDetailSelect,
  QuotesQuery,
  UpdateQuoteInput,
  PaginatedQuotesList,
} from "./quotes.types.js";
import { InternalServerError } from "@/shared/error/error.js";

export class QuotesRepository {
  // ============================================================
  // LISTE PAGINÉE DES DEVIS
  // ============================================================
  async findAll(query: QuotesQuery): Promise<PaginatedQuotesList> {
    const {
      page,
      limit,
      search,
      status,
      clientId,
      sortBy,
      sortOrder,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.QuoteWhereInput = { deletedAt: null };

    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    // Filtre par plage de dates
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Recherche textuelle
    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { client: { firstName: { contains: search, mode: "insensitive" } } },
        { client: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        select: quoteListSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.quote.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
        search,
        status,
        clientId,
        sortBy,
        sortOrder,
      },
    };
  }

  // ============================================================
  // DÉTAIL D'UN DEVIS (avec commandes)
  // ============================================================
  async findById(id: number) {
    return await prisma.quote.findUnique({
      where: { id, deletedAt: null },
      select: quoteDetailSelect,
    });
  }

  // ============================================================
  // MISE À JOUR PARTIELLE D'UN DEVIS
  // ============================================================
  async update(id: number, data: UpdateQuoteInput) {
    return await prisma.quote.update({
      where: { id, deletedAt: null },
      data,
      select: quoteDetailSelect,
    });
  }

  // ============================================================
  // MARQUER COMME CONVERTI (lien vers la facture)
  // ============================================================
  async markAsConverted(quoteId: number, invoiceId: number) {
    return await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: "converted",
        // Si tu veux garder une trace de la facture créée
        // transformedToInvoice: invoiceId,
      },
      select: quoteDetailSelect,
    });
  }

  // ============================================================
  // SOFT DELETE D'UN DEVIS
  // ============================================================
  async softDelete(id: number) {
    return await prisma.quote.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: quoteDetailSelect,
    });
  }

  // ============================================================
  // RESTAURER UN DEVIS SOFT DELETE
  // ============================================================
  async restore(id: number) {
    return await prisma.quote.update({
      where: { id },
      data: { deletedAt: null },
      select: quoteDetailSelect,
    });
  }

  // ============================================================
  // CRÉER UNE FACTURE À PARTIR D'UN DEVIS
  // ============================================================
  async createInvoiceFromQuote(
    quote: any,
    userId: string,
    companyInfoId: number,
  ) {
    // Récupérer la companyInfo du devis
    const companyInfo = companyInfoId;

    // Générer le numéro de facture
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const currentCount = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(year, now.getMonth(), 1),
          lte: new Date(year, now.getMonth() + 1, 0, 23, 59, 59, 999),
        },
      },
    });

    const nextSequence = String(currentCount + 1).padStart(3, "0");
    const invoiceNumber = `F-${year}-${month}-${nextSequence}`;

    // 1. Créer la facture
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        clientId: quote.clientId,
        companyInfoId: companyInfo,
        createdById: userId,
        total: quote.total,
        deposit: 0,
        paymentStatus: "unpaid",
        isDelivered: false,
        originalQuoteId: quote.id, // Lien vers le devis
      },
      select: {
        id: true,
        number: true,
        total: true,
        deposit: true,
        paymentStatus: true,
        isDelivered: true,
        clientId: true,
        createdAt: true,
      },
    });

    // 2. Copier les commandes du devis vers la facture
    if (quote.orders && quote.orders.length > 0) {
      for (const order of quote.orders) {
        await prisma.order.create({
          data: {
            reference: `CMD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            designation: order.designation,
            clientId: quote.clientId,
            invoiceId: invoice.id,
            productId: order.productId,
            dimensions: order.dimensions,
            label: order.label,
            quantity: order.quantity,
            unitPrice: order.unitPrice,
            createdById: userId,
            status: "waiting_for_file",
          },
        });
      }
    }

    return invoice;
  }
}

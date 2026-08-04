// backend/src/features/quotes/quotes.service.ts
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  ConflictError,
} from "@/shared/error/error.js";
import { QuotesRepository } from "./quotes.repository.js";
import {
  QuotesQuery,
  UpdateQuoteInput,
  QuoteDetailOutput,
} from "./quotes.types.js";
import { QUOTE_ERRORS } from "./quotes.constants.js";
import { CompanyInfoRepository } from "../company-info/company-info.repository.js";

export class QuotesService {
  constructor(
    private readonly quotesRepository: QuotesRepository,
    private readonly companyInfoRepository: CompanyInfoRepository,
  ) {}

  // ============================================================
  // LISTE PAGINÉE DES DEVIS
  // ============================================================
  async listQuotes(query: QuotesQuery) {
    return await this.quotesRepository.findAll(query);
  }

  // ============================================================
  // DÉTAIL D'UN DEVIS
  // ============================================================
  async getQuoteById(id: number): Promise<QuoteDetailOutput> {
    const quote = await this.quotesRepository.findById(id);
    if (!quote) {
      throw new NotFoundError(QUOTE_ERRORS.NOT_FOUND);
    }
    return quote;
  }

  // ============================================================
  // MISE À JOUR PARTIELLE D'UN DEVIS
  // ============================================================
  async updateQuote(
    id: number,
    data: UpdateQuoteInput,
  ): Promise<QuoteDetailOutput> {
    await this.getQuoteById(id);

    if (Object.keys(data).length === 0) {
      throw new BadRequestError(QUOTE_ERRORS.NO_FIELDS_TO_UPDATE);
    }

    try {
      return await this.quotesRepository.update(id, data);
    } catch (error) {
      throw new InternalServerError(QUOTE_ERRORS.UPDATE_FAILED);
    }
  }

  // ============================================================
  // CONVERTIR UN DEVIS EN FACTURE
  // ============================================================
  async convertToInvoice(quoteId: number, userId: string) {
    const quote = await this.getQuoteById(quoteId);

    if (quote.status === "converted") {
      throw new ConflictError(QUOTE_ERRORS.ALREADY_CONVERTED);
    }

    const companyInfo = await this.companyInfoRepository.findActive();
    if (!companyInfo) {
      throw new InternalServerError("Aucune information société trouvée");
    }
    const companyInfoId = companyInfo.id;

    try {
      // 1. Créer une facture à partir du devis
      const invoice = await this.quotesRepository.createInvoiceFromQuote(
        quote,
        userId,
        companyInfoId,
      );

      // 2. Marquer le devis comme converti
      await this.quotesRepository.markAsConverted(quoteId, invoice.id);

      return { invoice, quoteId };
    } catch (error) {
      throw new InternalServerError(QUOTE_ERRORS.CONVERT_FAILED);
    }
  }

  // ============================================================
  // SOFT DELETE D'UN DEVIS
  // ============================================================
  async softDeleteQuote(id: number) {
    await this.getQuoteById(id);

    try {
      const quote = await this.quotesRepository.softDelete(id);
      return quote;
    } catch (error) {
      throw new InternalServerError(QUOTE_ERRORS.DELETE_FAILED);
    }
  }

  // ============================================================
  // RESTAURER UN DEVIS
  // ============================================================
  async restoreQuote(id: number) {
    try {
      const quote = await this.quotesRepository.restore(id);
      return quote;
    } catch (error) {
      throw new InternalServerError(QUOTE_ERRORS.RESTORE_FAILED);
    }
  }
}

export const quotesService = new QuotesService(
  new QuotesRepository(),
  new CompanyInfoRepository(),
);

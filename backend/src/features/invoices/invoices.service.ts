// backend/src/features/invoices/invoices.service.ts
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "@/shared/error/error.js";
import { InvoicesRepository } from "./invoices.repository.js";
import { OrdersRepository } from "../orders/orders.repository.js";
import {
  InvoicesQuery,
  UpdateInvoiceInput,
  AddPaymentInput,
  InvoiceDetailOutput,
} from "./invoices.types.js";
import { INVOICE_ERRORS } from "./invoices.constants.js";

export class InvoicesService {
  constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  // ============================================================
  // LISTE PAGINÉE DES FACTURES
  // ============================================================
  async listInvoices(query: InvoicesQuery) {
    return await this.invoicesRepository.findAll(query);
  }

  // ============================================================
  // DÉTAIL D'UNE FACTURE
  // ============================================================
  async getInvoiceById(id: number): Promise<InvoiceDetailOutput> {
    const invoice = await this.invoicesRepository.findById(id);
    if (!invoice) {
      throw new NotFoundError(INVOICE_ERRORS.NOT_FOUND);
    }
    return invoice;
  }

  // ============================================================
  // MISE À JOUR PARTIELLE D'UNE FACTURE
  // ============================================================
  async updateInvoice(
    id: number,
    data: UpdateInvoiceInput,
  ): Promise<InvoiceDetailOutput> {
    await this.getInvoiceById(id);

    if (Object.keys(data).length === 0) {
      throw new BadRequestError(INVOICE_ERRORS.NO_FIELDS_TO_UPDATE);
    }

    try {
      return await this.invoicesRepository.update(id, data);
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.UPDATE_FAILED);
    }
  }

  // ============================================================
  // MARQUER UNE FACTURE COMME LIVRÉE (avec propagation aux commandes)
  // ============================================================
  async markAsDelivered(id: number): Promise<InvoiceDetailOutput> {
    await this.getInvoiceById(id);

    try {
      const invoice = await this.invoicesRepository.markAsDelivered(id);
      return invoice;
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.DELIVER_FAILED);
    }
  }

  // ============================================================
  // AJOUT D'UN PAIEMENT
  // ============================================================
  async addPayment(invoiceId: number, userId: string, data: AddPaymentInput) {
    const invoice = await this.getInvoiceById(invoiceId);
    const invoiceRemaining = invoice.total - invoice.deposit;
    if (invoice.paymentStatus === "paid") {
      throw new BadRequestError(INVOICE_ERRORS.ALREADY_PAID);
    }

    if (data.amount > invoiceRemaining) {
      throw new BadRequestError(INVOICE_ERRORS.PAYMENT_EXCEEDS_REMAINING);
    }

    try {
      const payment = await this.invoicesRepository.addPayment(
        invoiceId,
        userId,
        data,
      );
      return payment;
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.PAYMENT_FAILED);
    }
  }

  // ============================================================
  // SUPPRESSION D'UN PAIEMENT
  // ============================================================
  async deletePayment(paymentId: number) {
    try {
      await this.invoicesRepository.deletePayment(paymentId);
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.DELETE_PAYMENT_FAILED);
    }
  }

  // ============================================================
  // SOFT DELETE D'UNE FACTURE
  // ============================================================
  async softDeleteInvoice(id: number) {
    await this.getInvoiceById(id);

    try {
      const invoice = await this.invoicesRepository.softDelete(id);
      return invoice;
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.DELETE_FAILED);
    }
  }

  // ============================================================
  // RESTAURER UNE FACTURE
  // ============================================================
  async restoreInvoice(id: number) {
    try {
      const invoice = await this.invoicesRepository.restore(id);
      return invoice;
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.RESTORE_FAILED);
    }
  }
}

export const invoicesService = new InvoicesService(
  new InvoicesRepository(),
  new OrdersRepository(),
);

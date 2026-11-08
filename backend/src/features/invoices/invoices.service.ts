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
  InvoiceStats,
} from "./invoices.types.js";
import { INVOICE_ERRORS, INVOICE_STATS_ERRORS } from "./invoices.constants.js";
import { prisma } from "@/config/prisma.js";
import { paymentAuditLogService } from "@/features/payment-audit-log/index.js";

export class InvoicesService {
  constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async listInvoices(query: InvoicesQuery) {
    return await this.invoicesRepository.findAll(query);
  }

  async getInvoiceById(id: number): Promise<InvoiceDetailOutput> {
    const invoice = await this.invoicesRepository.findById(id);
    if (!invoice) {
      throw new NotFoundError(INVOICE_ERRORS.NOT_FOUND);
    }
    return invoice;
  }

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

  async markAsDelivered(id: number): Promise<InvoiceDetailOutput> {
    await this.getInvoiceById(id);

    try {
      const invoice = await this.invoicesRepository.markAsDelivered(id);
      return invoice;
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.DELIVER_FAILED);
    }
  }

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
      return await prisma.$transaction(async (tx) => {
        const payment = await this.invoicesRepository.addPayment(
          tx,
          invoiceId,
          userId,
          data,
        );

        await paymentAuditLogService.create(tx, {
          action: "CREATE",
          paymentId: payment.id,
          userId,
          oldData: null,
          newData: {
            ...payment,
            invoice: {
              id: invoiceId,
              number: invoice.number,
            },
          },
        });

        return payment;
      });
    } catch {
      throw new InternalServerError(INVOICE_ERRORS.PAYMENT_FAILED);
    }
  }

  async deletePayment(paymentId: number, userId: string) {
    try {
      await prisma.$transaction(async (tx) => {
        // On récupère l'ancien état avant suppression
        const oldPayment = await tx.payment.findUnique({
          where: { id: paymentId, deletedAt: null },
          include: {
            invoice: {
              select: { id: true, number: true },
            },
          },
        });
        await this.invoicesRepository.deletePayment(tx, paymentId);

        if (oldPayment) {
          await paymentAuditLogService.create(tx, {
            action: "DELETE",
            paymentId,
            userId,
            oldData: oldPayment,
            newData: null,
          });
        }
      });
    } catch {
      throw new InternalServerError(INVOICE_ERRORS.DELETE_PAYMENT_FAILED);
    }
  }

  async softDeleteInvoice(id: number) {
    await this.getInvoiceById(id);

    try {
      const invoice = await this.invoicesRepository.softDelete(id);
      return invoice;
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.DELETE_FAILED);
    }
  }

  async restoreInvoice(id: number) {
    try {
      const invoice = await this.invoicesRepository.restore(id);
      return invoice;
    } catch (error) {
      throw new InternalServerError(INVOICE_ERRORS.RESTORE_FAILED);
    }
  }

  async getStats(): Promise<InvoiceStats> {
    try {
      return await this.invoicesRepository.getStats();
    } catch (error) {
      throw new InternalServerError(INVOICE_STATS_ERRORS.STATS_FAILED);
    }
  }
}

export const invoicesService = new InvoicesService(
  new InvoicesRepository(),
  new OrdersRepository(),
);

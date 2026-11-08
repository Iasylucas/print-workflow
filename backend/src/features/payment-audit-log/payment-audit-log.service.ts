import { PaymentAuditLogRepository } from "./payment-audit-log.repository.js";
import {
  PaymentAuditLogStats,
  PaymentAuditLogOutput,
  CreatePaymentAuditLogInput,
  PaymentAuditLogQuery,
  PaginatedPaymentAuditLogList,
} from "./payment-audit-log.types.js";
import { NotFoundError, InternalServerError } from "@/shared/error/error.js";
import { PAYMENT_AUDIT_LOG_ERRORS } from "./payment-audit-log.constants.js";
import { Prisma } from "@/generated/prisma/client.js";

export class PaymentAuditLogService {
  constructor(
    private readonly paymentAuditLogRepository: PaymentAuditLogRepository,
  ) {}

  // ============================================================
  // CRÉER UNE ENTRÉE D'AUDIT (appelé depuis PaymentService)
  // ============================================================
  async create(
    tx: Prisma.TransactionClient,
    data: CreatePaymentAuditLogInput,
  ): Promise<PaymentAuditLogOutput> {
    try {
      return await this.paymentAuditLogRepository.create(tx, data);
    } catch {
      throw new InternalServerError(PAYMENT_AUDIT_LOG_ERRORS.FAILED_CREATION);
    }
  }

  // ============================================================
  // LISTER L'HISTORIQUE (pagination, filtres)
  // ============================================================
  async list(
    query: PaymentAuditLogQuery,
  ): Promise<PaginatedPaymentAuditLogList> {
    try {
      return await this.paymentAuditLogRepository.findAll(query);
    } catch {
      throw new InternalServerError(PAYMENT_AUDIT_LOG_ERRORS.FAILED_FETCHING);
    }
  }

  // ============================================================
  // DÉTAIL D'UNE ENTRÉE D'AUDIT
  // ============================================================
  async getById(id: string): Promise<PaymentAuditLogOutput> {
    const log = await this.paymentAuditLogRepository.findById(id);
    if (!log) {
      throw new NotFoundError(PAYMENT_AUDIT_LOG_ERRORS.NOT_FOUND);
    }
    return log;
  }

  // ============================================================
  // HISTORIQUE D'UN PAIEMENT
  // ============================================================
async getByPaymentId(paymentId: number): Promise<PaymentAuditLogOutput[]> {
    return await this.paymentAuditLogRepository.getByPaymentId(paymentId);
  }

  // ============================================================
  // STATISTIQUES D'AUDIT
  // ============================================================
  async getStats(query: PaymentAuditLogQuery): Promise<PaymentAuditLogStats> {
    try {
      return await this.paymentAuditLogRepository.getStats(query);
    } catch {
      throw new InternalServerError(PAYMENT_AUDIT_LOG_ERRORS.FAILED_FETCHING);
    }
}
}

export const paymentAuditLogService = new PaymentAuditLogService(
  new PaymentAuditLogRepository(),
);

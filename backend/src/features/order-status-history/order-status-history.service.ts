import { InternalServerError, NotFoundError } from "@/shared/error/error.js";
import { Prisma } from "@/generated/prisma/client.js";
import { OrderStatusHistoryRepository } from "./order-status-history.repository.js";
import { ORDER_STATUS_HISTORY_ERRORS } from "./order-status-history.constants.js";
import {
  CreateOrderStatusHistoryInput,
  OrderStatusHistoryOutput,
  OrderStatusHistoryQuery,
  PaginatedOrderStatusHistoryList,
} from "./order-status-history.types.js";

export class OrderStatusHistoryService {
  constructor(
    private readonly orderStatusHistoryRepository: OrderStatusHistoryRepository,
  ) {}

  // ============================================================
  // CRÉER UNE ENTRÉE D'HISTORIQUE (appelé depuis OrdersService)
  // ============================================================
  async create(
    tx: Prisma.TransactionClient,
    data: CreateOrderStatusHistoryInput,
  ): Promise<OrderStatusHistoryOutput> {
    try {
      return await this.orderStatusHistoryRepository.create(tx, data);
    } catch {
      throw new InternalServerError(
        ORDER_STATUS_HISTORY_ERRORS.CREATE_FAILED,
      );
    }
  }

  // ============================================================
  // LISTER L'HISTORIQUE (filtres + pagination)
  // ============================================================
  async list(
    query: OrderStatusHistoryQuery,
  ): Promise<PaginatedOrderStatusHistoryList> {
    try {
      return await this.orderStatusHistoryRepository.findAll(query);
    } catch {
      throw new InternalServerError(
        ORDER_STATUS_HISTORY_ERRORS.FETCH_FAILED,
      );
    }
  }

  // ============================================================
  // HISTORIQUE D'UNE COMMANDE
  // ============================================================
  async getByOrderId(orderId: number): Promise<OrderStatusHistoryOutput[]> {
    try {
      return await this.orderStatusHistoryRepository.findByOrderId(orderId);
    } catch {
      throw new InternalServerError(
        ORDER_STATUS_HISTORY_ERRORS.FETCH_FAILED,
      );
    }
  }

  // ============================================================
  // DÉTAIL D'UNE ENTRÉE
  // ============================================================
  async getById(id: number): Promise<OrderStatusHistoryOutput> {
    const entry = await this.orderStatusHistoryRepository.findById(id);
    if (!entry) {
      throw new NotFoundError(ORDER_STATUS_HISTORY_ERRORS.NOT_FOUND);
    }
    return entry;
  }
}

export const orderStatusHistoryService = new OrderStatusHistoryService(
  new OrderStatusHistoryRepository(),
);
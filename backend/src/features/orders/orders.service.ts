import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  InternalServerError,
} from "@/shared/error/error.js";
import { OrdersRepository } from "./orders.repository.js";
import {
  OrdersQuery,
  UpdateOrderInput,
  AddOrderNoteInput,
  AddOrderFileInput,
  UpdateOrderStatusInput,
  OrderDetailOutput,
} from "./orders.types.js";
import { ORDERS_ERRORS } from "./orders.constants.js";

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async listOrders(query: OrdersQuery) {
    return await this.ordersRepository.findAll(query);
  }

  async getOrderById(id: number): Promise<OrderDetailOutput> {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(ORDERS_ERRORS.NOT_FOUND);
    }
    return order;
  }

  async updateOrder(
    id: number,
    data: UpdateOrderInput,
  ): Promise<OrderDetailOutput> {
    await this.getOrderById(id);

    if (Object.keys(data).length === 0) {
      throw new BadRequestError(ORDERS_ERRORS.NO_FIELDS_TO_UPDATE);
    }

    try {
      return await this.ordersRepository.update(id, data);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.UPDATE_FAILED);
    }
  }

  async updateOrderStatus(
    id: number,
    data: UpdateOrderStatusInput,
  ): Promise<OrderDetailOutput> {
    const order = await this.getOrderById(id);

    try {
      return await this.ordersRepository.updateStatus(id, data.status);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.UPDATE_FAILED);
    }
  }

  async addNote(orderId: number, userId: string, data: AddOrderNoteInput) {
    await this.getOrderById(orderId);

    try {
      return await this.ordersRepository.addNote(orderId, userId, data);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.NOTE_FAILED);
    }
  }

  async addFile(orderId: number, userId: string, data: AddOrderFileInput) {
    await this.getOrderById(orderId);
    try {
      return await this.ordersRepository.addFile(orderId, userId, data);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.FILE_FAILED);
    }
  }

  async deleteNote(noteId: number, userId: string, userRole: string) {
    try {
      return await this.ordersRepository.deleteNote(noteId);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.DELETE_NOTE_FAILED);
    }
  }

  async deleteFile(fileId: number, userId: string, userRole: string) {
    try {
      return await this.ordersRepository.deleteFile(fileId, userId);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.DELETE_FILE_FAILED);
    }
  }
}

export const ordersService = new OrdersService(new OrdersRepository());

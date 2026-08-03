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

// Constantes d'erreur à créer dans orders.constants.ts
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  // ============================================
  // LISTE PAGINÉE DES COMMANDES
  // ============================================
  async listOrders(query: OrdersQuery) {
    return await this.ordersRepository.findAll(query);
  }

  // ============================================
  // DÉTAIL D'UNE COMMANDE
  // ============================================
  async getOrderById(id: number): Promise<OrderDetailOutput> {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(ORDERS_ERRORS.NOT_FOUND);
    }
    return order;
  }

  // ============================================
  // MISE À JOUR PARTIELLE (designation, label, dimensions, quantity, unitPrice)
  // ============================================
  async updateOrder(
    id: number,
    data: UpdateOrderInput,
  ): Promise<OrderDetailOutput> {
    // Vérifier que la commande existe
    await this.getOrderById(id);

    // Vérifier qu'au moins un champ est fourni
    if (Object.keys(data).length === 0) {
      throw new BadRequestError(ORDERS_ERRORS.NO_FIELDS_TO_UPDATE);
    }

    try {
      return await this.ordersRepository.update(id, data);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.UPDATE_FAILED);
    }
  }

  // ============================================
  // MISE À JOUR DU STATUT
  // ============================================
  async updateOrderStatus(
    id: number,
    data: UpdateOrderStatusInput,
  ): Promise<OrderDetailOutput> {
    const order = await this.getOrderById(id);

    // Vérification de transition (optionnel)
    // if (!this.isValidTransition(order.status, data.status)) {
    //   throw new BadRequestError(ORDERS_ERRORS.INVALID_STATUS_TRANSITION);
    // }

    try {
      return await this.ordersRepository.updateStatus(id, data.status);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.UPDATE_FAILED);
    }
  }

  // ============================================
  // AJOUT D'UNE NOTE
  // ============================================
  async addNote(orderId: number, userId: string, data: AddOrderNoteInput) {
    await this.getOrderById(orderId);

    try {
      return await this.ordersRepository.addNote(orderId, userId, data);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.NOTE_FAILED);
    }
  }

  // ============================================
  // AJOUT D'UN FICHIER (VISUEL)
  // ============================================
  async addFile(orderId: number, userId: string, data: AddOrderFileInput) {
    await this.getOrderById(orderId);
    console.log("orderId:", orderId, "userId:", userId, "data:", data);
    try {
      return await this.ordersRepository.addFile(orderId, userId, data);
    } catch (error) {
      console.log(error);

      throw new InternalServerError(ORDERS_ERRORS.FILE_FAILED);
    }
  }

  // ============================================
  // SUPPRESSION D'UNE NOTE
  // ============================================
  async deleteNote(noteId: number, userId: string, userRole: string) {
    // Vérifier que la note existe (on peut ajouter un find)
    // Pour l'instant, seul l'admin ou le créateur peut supprimer
    // (à implémenter selon vos besoins)
    try {
      return await this.ordersRepository.deleteNote(noteId);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.DELETE_NOTE_FAILED);
    }
  }

  // ============================================
  // SUPPRESSION D'UN FICHIER
  // ============================================
  async deleteFile(fileId: number, userId: string, userRole: string) {
    try {
      return await this.ordersRepository.deleteFile(fileId, userId);
    } catch (error) {
      throw new InternalServerError(ORDERS_ERRORS.DELETE_FILE_FAILED);
    }
  }
}

export const ordersService = new OrdersService(new OrdersRepository());

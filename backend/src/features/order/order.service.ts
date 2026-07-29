import z from "zod";
import { InvoicesRepository } from "../invoices/invoices.repository.js";
import { OrderRepository } from "./order.repository.js";
import { updateOrderFromPosSchema } from "./order.schema.js";
import { CreateBulkOrderInput } from "./order.types.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/shared/error/error.js"; // Adaptez selon vos erreurs globales

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly invoiceRepository: InvoicesRepository,
  ) {}
  // backend/src/features/order/order.service.ts
  // order.service.ts

  private async generateOrderReference(index: number): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Compter le nombre total de lignes déjà créées
    const totalLines = await this.orderRepository.countOrderLinesByMonth(
      year,
      now.getMonth() + 1,
    );
    const sequence = String(totalLines + index + 1).padStart(3, "0");

    return `C-${year}-${month}-${sequence}`;
  }
  // 1. Fonction privée pour formater les numéros avec des zéros initiaux (ex: 1 -> "001")
  private padNumber(num: number, size: number = 3): string {
    let s = num.toString();
    while (s.length < size) s = "0" + s;
    return s;
  }

  async createBulkOrder(data: CreateBulkOrderInput, currentUserId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = this.padNumber(now.getMonth() + 1, 2);

    let generatedNumber = "";

    try {
      if (data.documentType === "INVOICE") {
        const currentCount = await this.orderRepository.countInvoicesByMonth(
          currentYear,
          now.getMonth() + 1,
        );
        const nextSequence = this.padNumber(currentCount + 1, 3);
        generatedNumber = `F-${currentYear}-${currentMonth}-${nextSequence}`;
      } else {
        const currentCount = await this.orderRepository.countQuotesByMonth(
          currentYear,
          now.getMonth() + 1,
        );
        const nextSequence = this.padNumber(currentCount + 1, 3);
        generatedNumber = `D-${currentYear}-${currentMonth}-${nextSequence}`;
      }
    } catch (error) {
      throw new InternalServerError(
        "Échec du calcul du compteur de numérotation séquentielle.",
      );
    }

    let calculatedTotal = 0;
    for (const line of data.lines) {
      calculatedTotal += line.unitPrice * line.quantity;
    }

    if (data.documentType === "INVOICE" && data.deposit > calculatedTotal) {
      throw new BadRequestError(
        "Le montant de l'acompte ne peut pas excéder le montant total de la facture.",
      );
    }

    const companyInfoId = 1;

    const orderReferences = await Promise.all(
      data.lines.map((_, index) => this.generateOrderReference(index)),
    );

    try {
      const result = await this.orderRepository.createBulk(
        data,
        generatedNumber,
        orderReferences, // ← NOUVEAU PARAMÈTRE
        currentUserId,
        companyInfoId,
        calculatedTotal,
      );
      return result;
    } catch (error) {
      console.log(error);

      throw new InternalServerError(
        "Une erreur technique est survenue lors de la validation finale du panier.",
      );
    }
  }

  async getOrderForPos(orderId: number) {
    const order = await this.orderRepository.findOrderWithDetails(orderId);
    if (!order) {
      throw new NotFoundError("Commande introuvable");
    }
    return order;
  }

  // order.service.ts
  // order.service.ts
  async updateOrderFromPos(
    invoiceId: number,
    data: z.infer<typeof updateOrderFromPosSchema>,
    userId: string,
  ) {
    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) throw new NotFoundError("Facture introuvable");

    // ✅ TOUT EN TRANSACTION
    return await this.orderRepository.updateOrderFromPosTransaction(
      invoiceId,
      data,
      userId,
      invoice.clientId,
    );
  }

  async getInvoiceForPos(invoiceId: number) {
    return await this.orderRepository.findInvoiceWithFirstNote(invoiceId);
  }

  async getInvoicePaymentsForPos(invoiceId: number) {
    return await this.orderRepository.findInvoicePayments(invoiceId);
  }
}

export const orderService = new OrderService(
  new OrderRepository(),
  new InvoicesRepository(), // ← AJOUT
);

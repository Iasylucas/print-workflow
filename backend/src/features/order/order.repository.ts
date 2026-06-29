import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import { orderFullSelect } from "./order.types.js";
import type {
  CreateBulkOrderInput,
  CreateSingleOrderLineInput,
} from "./order.types.js";

export class OrderRepository {
  // 1. Compter le nombre de factures (Invoices) créées pour un mois et une année spécifiques
  async countInvoicesByMonth(year: number, month: number): Promise<number> {
    // Définition de la plage de recherche (Du 1er au dernier jour du mois)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await prisma.invoice.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // 2. Compter le nombre de devis (Quotes) créés pour un mois et une année spécifiques
  async countQuotesByMonth(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await prisma.quote.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // 3. Insérer le panier complet du POS en une seule transaction SQL isolée
  async createBulk(
    data: CreateBulkOrderInput,
    generatedNumber: string,
    referenceUnique: string,
    currentUserId: string,
    companyInfoId: number,
    calculatedTotal: number,
  ) {
    return await prisma.$transaction(async (tx) => {
      let createdInvoiceId: number | null = null;
      let createdQuoteId: number | null = null;

      // 📜 CRÉATION DU DOCUMENT FINANCIER GLOBAL
      if (data.documentType === "INVOICE") {
        const invoice = await tx.invoice.create({
          data: {
            number: generatedNumber,
            clientId: data.clientId,
            companyInfoId: companyInfoId,
            createdById: currentUserId,
            total: calculatedTotal,
            deposit: data.deposit,
            remaining: calculatedTotal - data.deposit,
            deliveryPlace: data.deliveryPlace,
            expectedDeliveryDate: data.expectedDeliveryDate,
            paymentStatus:
              data.deposit >= calculatedTotal
                ? "paid"
                : data.deposit > 0
                  ? "partial"
                  : "unpaid",
          },
        });
        createdInvoiceId = invoice.id;

        // Si un acompte direct est versé au POS, on enregistre immédiatement la ligne de paiement
        if (data.deposit > 0) {
          await tx.payment.create({
            data: {
              invoiceId: invoice.id,
              amount: data.deposit,
              method: "CASH", // Méthode par défaut du POS au comptoir (modifiable)
              reference: `Acompte POS ${generatedNumber}`,
              receivedById: currentUserId,
            },
          });
        }
      } else {
        const quote = await tx.quote.create({
          data: {
            number: generatedNumber,
            clientId: data.clientId,
            companyInfoId: companyInfoId,
            createdById: currentUserId,
            total: calculatedTotal,
            status: "pending",
          },
        });
        createdQuoteId = quote.id;
      }

      // 🛠️ Remplacement de la boucle classique par un for...of
      let lineIndex = 0;

      for (const line of data.lines) {
        // Génération de la sous-référence unique (ex: CMD-202606-A1-0)
        const itemReference = `${referenceUnique}-${lineIndex}`;

        const createdOrder = await tx.order.create({
          data: {
            reference: itemReference,
            designation: line.designation,
            clientId: data.clientId,
            invoiceId: createdInvoiceId,
            quoteId: createdQuoteId,
            variantId: line.variantId,
            pricingRuleId: line.pricingRuleId,
            options: line.options as Prisma.InputJsonValue,
            widthCm: line.widthCm,
            heightCm: line.heightCm,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            totalPrice: line.totalPrice,
            createdById: currentUserId,
            status: "waiting_for_file",
          },
        });

        // Gestion des notes de production
        if (line.atelierNote && line.atelierNote.trim() !== "") {
          await tx.note.create({
            data: {
              text: line.atelierNote.trim(),
              userId: currentUserId,
              orderId: createdOrder.id,
            },
          });
        }

        // Incrémentation pour la ligne suivante du panier
        lineIndex++;
      }

      // On renvoie le statut du type de document généré pour le contrôleur
      return {
        documentType: data.documentType,
        documentNumber: generatedNumber,
        total: calculatedTotal,
      };
    });
  }
}

import { OrderRepository } from "./order.repository.js";
import { CreateBulkOrderInput } from "./order.types.js";
import { BadRequestError, InternalServerError } from "@/shared/error/error.js"; // Adaptez selon vos erreurs globales

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

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

    // B. Récupération et incrémentation automatique du compteur mensuel
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

    // C. Recalcul sécurisé du total (sans totalPrice envoyé par le front)
    let calculatedTotal = 0;

    for (const line of data.lines) {
      calculatedTotal += line.unitPrice * line.quantity;
    }

    // Sécurité : L'acompte ne peut pas être strictement supérieur au montant global facturé
    if (data.documentType === "INVOICE" && data.deposit > calculatedTotal) {
      throw new BadRequestError(
        "Le montant de l'acompte ne peut pas excéder le montant total de la facture.",
      );
    }

    const companyInfoId = 1;

    try {
      const result = await this.orderRepository.createBulk(
        data,
        generatedNumber,
        currentUserId,
        companyInfoId,
        calculatedTotal,
      );
      return result;
    } catch (error) {
      throw new InternalServerError(
        "Une erreur technique est survenue lors de la validation finale du panier.",
      );
    }
  }
}
// 2. Fonction centrale d'orchestration du panier POS (Bulk Order)
// async createBulkOrder(data: CreateBulkOrderInput, currentUserId: string) {
//   // A. Récupération instantanée de la date du jour (Serveur)
//   const now = new Date();
//   const currentYear = now.getFullYear(); // ex: 2026
//   const currentMonth = this.padNumber(now.getMonth() + 1, 2); // ex: "06"

//   let generatedNumber = "";
//   let referenceUnique = "";

//   // B. Récupération et incrémentation automatique du compteur mensuel
//   try {
//     if (data.documentType === "INVOICE") {
//       const currentCount = await this.orderRepository.countInvoicesByMonth(
//         currentYear,
//         now.getMonth() + 1,
//       );
//       const nextSequence = this.padNumber(currentCount + 1, 3);

//       // Construction de votre format cible : F-2026-06-001
//       generatedNumber = `F-${currentYear}-${currentMonth}-${nextSequence}`;
//       referenceUnique = `CMD-INV-${currentYear}${currentMonth}-${nextSequence}`;
//     } else {
//       const currentCount = await this.orderRepository.countQuotesByMonth(
//         currentYear,
//         now.getMonth() + 1,
//       );
//       const nextSequence = this.padNumber(currentCount + 1, 3);

//       // Construction de votre format cible : D-2026-06-001
//       generatedNumber = `D-${currentYear}-${currentMonth}-${nextSequence}`;
//       referenceUnique = `CMD-QUO-${currentYear}${currentMonth}-${nextSequence}`;
//     }
//   } catch (error) {
//     throw new InternalServerError(
//       "Échec du calcul du compteur de numérotation séquentielle.",
//     );
//   }

//   // C. Validation financière et recalcul de sécurité anti-fraude
//   let calculatedTotal = 0;

//   for (const line of data.lines) {
//     const expectedLineTotal = line.unitPrice * line.quantity;

//     // Sécurité : Validation de la cohérence mathématique envoyée par le POS
//     if (line.totalPrice !== expectedLineTotal) {
//       throw new BadRequestError(
//         `Incohérence financière détectée sur la ligne : ${line.designation}.`,
//       );
//     }

//     calculatedTotal += line.totalPrice;
//   }

//   // Sécurité : L'acompte ne peut pas être strictement supérieur au montant global facturé
//   if (data.documentType === "INVOICE" && data.deposit > calculatedTotal) {
//     throw new BadRequestError(
//       "Le montant de l'acompte ne peut pas excéder le montant total de la facture.",
//     );
//   }

//   // D. ID fixe pour CompanyInfo par défaut (Toujours la ligne 1 pour l'entreprise principale)
//   const companyInfoId = 1;

//   // E. Exécution de la transaction sécurisée en base de données
//   try {
//     const result = await this.orderRepository.createBulk(
//       data,
//       generatedNumber,
//       referenceUnique,
//       currentUserId,
//       companyInfoId,
//       calculatedTotal,
//     );

//     return result;
//   } catch (error) {
//     throw new InternalServerError(
//       "Une erreur technique est survenue lors de la validation finale du panier.",
//     );
//   }
// }
// }

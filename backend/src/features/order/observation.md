Excellent ! Je vois une architecture globalement solide avec quelques points d'amélioration. Analysons tout ça en détail.

## 📊 Analyse Globale

### Ce qui est bien fait ✅

- **Séparation des responsabilités** (Repository → Service → Controller)
- **Transactions Prisma** bien utilisées
- **Validation Zod** solide
- **Typage TypeScript** présent
- **Gestion des erreurs** avec classes custom

### Points d'amélioration 🔧

---

## 1. **Problèmes Critiques**

### 🚨 **Génération des références en doublon potentiel**

```typescript
// ❌ PROBLÈME : Race condition possible
async generateOrderReference(index: number): Promise<string> {
  const totalLines = await this.orderRepository.countOrderLinesByMonth(...)
  const sequence = String(totalLines + index + 1).padStart(3, "0")
  return `C-${year}-${month}-${sequence}`
}
```

**Risque** : Si deux utilisateurs créent des commandes en même temps, ils peuvent avoir la même séquence.

**Solution** :

```typescript
// ✅ CORRECTION : Utiliser une séquence DB ou un verrou
async generateOrderReference(index: number): Promise<string> {
  // Option 1: Utiliser une table de séquence
  const sequence = await prisma.sequence.create({
    data: { name: `ORDER-${year}-${month}` }
  })

  // Option 2: Utiliser un compteur avec transaction
  return await prisma.$transaction(async (tx) => {
    const counter = await tx.counter.update({
      where: { key: `order-${year}-${month}` },
      data: { value: { increment: 1 } },
      select: { value: true }
    });
    return `C-${year}-${month}-${String(counter.value).padStart(3, '0')}`;
  });
}
```

### 🚨 **Calcul du total côté serveur à sécuriser**

```typescript
// ❌ DANGER : Le client peut envoyer des prix modifiés
calculatedTotal += line.unitPrice * line.quantity;
// Le client pourrait envoyer unitPrice: 1 au lieu de 22000
```

**Solution** : Recalculer les prix côté serveur

```typescript
// ✅ CORRECTION : Recalculer depuis la base
async createBulkOrder(data: CreateBulkOrderInput, currentUserId: string) {
  let calculatedTotal = 0;

  for (const line of data.lines) {
    // Recalculer le prix depuis la base
    const rule = await this.pricingRepository.findByVariant(line.variantId);
    if (!rule) throw new BadRequestError(`Règle de prix introuvable pour ${line.designation}`);

    // Recalculer selon le mode (PER_M2, FORMAT, etc.)
    const recalculatedPrice = await this.priceCalculator.calculate(
      rule,
      line.quantity,
      line.dimensions
    );

    // Vérifier que le prix correspond
    if (Math.abs(recalculatedPrice - line.unitPrice) > 0.01) {
      throw new BadRequestError(`Prix incohérent pour ${line.designation}`);
    }

    calculatedTotal += recalculatedPrice * line.quantity;
  }
}
```

---

## 2. **Problèmes de Performance**

### 🔄 **Appels DB en boucle avec N+1**

```typescript
// ❌ N+1 PROBLEM : Une requête par ligne
for (const line of data.lines) {
  const createdOrder = await tx.order.create({ ... });
  if (line.atelierNote) {
    await tx.note.create({ ... }); // ← Requête supplémentaire
  }
}
```

**Solution** : Utiliser `createMany`

```typescript
// ✅ OPTIMISATION : Création en masse
const orderData = data.lines.map((line, index) => ({
  reference: orderReferences[index],
  designation: line.designation,
  // ... autres champs
}));

const createdOrders = await tx.order.createMany({
  data: orderData,
  skipDuplicates: true,
});

// Puis créer toutes les notes en une seule fois
const noteData = data.lines
  .filter((line) => line.atelierNote?.trim())
  .map((line, index) => ({
    text: line.atelierNote!.trim(),
    userId: currentUserId,
    orderId: createdOrders[index].id, // ← Si createMany retourne les IDs
  }));

if (noteData.length > 0) {
  await tx.note.createMany({ data: noteData });
}
```

---

## 3. **Clean Code & TypeScript**

### 🧹 **Types mal définis**

```typescript
// ❌ any dans les types
async updateOrderLines(lines: { orderId: number; data: any }[]) {
  //                                ^^^
}
```

**Solution** :

```typescript
// ✅ Types précis
type OrderUpdateData = {
  productId?: number | null;
  designation?: string;
  label?: string | null;
  dimensions?: string | null;
  quantity?: number;
  unitPrice?: number;
};

async updateOrderLines(lines: { orderId: number; data: OrderUpdateData }[]) {
  const updates = lines.map(({ orderId, data }) =>
    prisma.order.update({
      where: { id: orderId, deletedAt: null },
      data,
    })
  );
  return await prisma.$transaction(updates);
}
```

### 🧹 **Méthode trop longue**

```typescript
// ❌ La méthode `createBulk` fait trop de choses
async createBulk(...) {
  // 1. Crée l'invoice/quote
  // 2. Crée les paiements
  // 3. Crée les orders
  // 4. Crée les notes
  // 5. Retourne le résultat
  // ➜ Trop de responsabilités !
}
```

**Solution** : Extraire en méthodes privées

```typescript
// ✅ REFACTORING
private async createDocument(
  tx: Prisma.TransactionClient,
  data: CreateBulkOrderInput,
  generatedNumber: string,
  calculatedTotal: number,
  companyInfoId: number,
  currentUserId: string
) {
  // ... création invoice/quote
}

private async createOrderLines(
  tx: Prisma.TransactionClient,
  data: CreateBulkOrderInput,
  createdInvoiceId: number | null,
  createdQuoteId: number | null,
  orderReferences: string[],
  currentUserId: string
) {
  // ... création des lignes
}

private async createNotes(
  tx: Prisma.TransactionClient,
  orders: any[],
  data: CreateBulkOrderInput,
  currentUserId: string
) {
  // ... création des notes
}
```

---

## 4. **Gestion des Erreurs**

### ⚠️ **Logs sans contexte**

```typescript
// ❌ Console log sans contexte
console.log(error);
```

**Solution** : Logger structuré

```typescript
// ✅ Meilleur logging
import logger from "@/shared/logger";

try {
  // ...
} catch (error) {
  logger.error("Erreur lors de la création du panier", {
    error: error.message,
    stack: error.stack,
    userId: currentUserId,
    documentType: data.documentType,
    linesCount: data.lines.length,
  });
  throw new InternalServerError("...");
}
```

---

## 5. **Zod Schema à améliorer**

### 📝 **Validation plus stricte**

```typescript
// ✅ Ajouter des validations métier
export const createSingleOrderLineSchema = z.object({
  // ...
  unitPrice: z
    .number()
    .int()
    .nonnegative("Le prix unitaire doit être positif ou nul")
    .refine((val) => val > 0, "Le prix unitaire doit être supérieur à 0"),

  // Validation des dimensions
  dimensions: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(x|×)\d+(\.\d+)?(cm|m)?$/i.test(val),
      "Format invalide. Utilisez '20x30cm' ou '1.5x3.5m'",
    ),
});

// Validation de cohérence du panier
export const createBulkOrderSchema = z
  .object({
    // ...
  })
  .refine(
    (data) => {
      if (data.documentType === "INVOICE" && data.deposit > 0) {
        return data.lines.some((line) => line.unitPrice > 0);
      }
      return true;
    },
    { message: "Impossible d'avoir un acompte sur un panier vide" },
  );
```

---

## 🎯 **Priorités d'action**

### **URGENT** (sécurité)

1. ✅ Sécuriser le calcul des prix côté serveur
2. ✅ Éviter les race conditions sur les références

### **IMPORTANT** (performance)

3. ✅ Optimiser les requêtes N+1
4. ✅ Utiliser `createMany` et `updateMany`

### **À FAIRE** (clean code)

5. ✅ Supprimer les `any` et `unknown`
6. ✅ Refactorer les méthodes trop longues
7. ✅ Ajouter des logs structurés

---

**Prêt pour le controller ?** Envoie-le-moi, je vais continuer l'analyse ! 🚀

Veux-tu que je te propose une version refactorisée complète du service avec les corrections appliquées ?

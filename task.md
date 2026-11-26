# Plan: Affichage Prix Produits à Multiples Variants (POS)

## Problème Actuel

- Uniquement `variants[0]` est utilisé dans `handleProductChange` (PosCart.tsx:133)
- Pour Flyers : seulement "Recto" s'affiche, "Recto Verso" manqué
- Bug identique pour tout produit avec >1 variante et mode FIXED

## Cause Racine

- `product.variants?.[0]?.pricingRules?.[0]?.config` ne prend que la 1ère variante
- Les autres variantes sont ignorées visuellement

## Solution Architecturale

Stocker **TOUS** les configs de variante keyed par le nom de la variante, au lieu d'un seul.

### Structure de Données Ciblée

```typescript
// Dans PosCartLine.productPricingConfig :
// Flyers: { Recto: {A4:1200, A3:2400}, "Recto Verso": {A4:1800, A3:3600} }
// Oriflamme: { Standard: {"2.8m":200000, "3.5m":240000, "4.5m":300000} }
// Impression: { Standard: {unit:100} }
```

## Fichiers Impactés (non modifiés ici - à faire demain)

1. `frontend/src/features/pos/types/pos.types.ts` - type `productPricingConfig`
2. `frontend/src/features/pos/components/PosCart.tsx` - `handleProductChange` + tooltip
3. Aucun autre fichier - la solution est isolée

## Plan d'Implémentation (3 Étapes)

### Étape 1: Types (pos.types.ts)

Modifier `productPricingConfig` pour accepter un objet dynamique :

```typescript
productPricingConfig?: Record<string, Record<string, number>>;
```

_Clé = nom variante, Valeur = config pricing_

### Étape 2: Gestion Produit (PosCart.tsx - handleProductChange)

Remplacer la ligne actuelle :

```typescript
// ACTUEL (buggé - 1 variante seulement)
onUpdateLine(index, "productPricingConfig",
  product.variants?.[0]?.pricingRules?.[0]?.config || {}
);

// NOUVEAU (toutes variantes)
onUpdateLine(index, "productPricingConfig",
  product.variants?.reduce<(Record<string, number>) => Record<string, Record<string, number>>>(
    (acc, variant) => {
      const config = variant.pricingRules?.[0]?.config;
      if (config) { acc[variant.name] = config; }
      return acc;
    },
    {}
  )
);
```

### Étape 3: Affichage Tooltip (PosCart.tsx)

Modifier le contenu du tooltip pour itérer sur toutes les variantes :

```typescript
{line.productPricingConfig && Object.keys(line.productPricingConfig).length > 0 ? (
  <p className="text-xs">
    {Object.entries(line.productPricingConfig)
      .map(([variantName, config]) =>
        `${variantName}: ${Object.entries(config)
          .map(([key, value]) => `${key} → ${value.toLocaleString()} Ar`)
          .join(", ")}`
      )
      .join(" | ")}
  </p>
) : (
  "Prix non disponible"
)}
```

## Résultat Attendu

| Produit     | Tooltip Affiche      |
| ----------- | -------------------- | --------------------- | -------------------- | ------- | ------- |
| Flyers      | Recto: A4→1200       | A3→2400               | Recto Verso: A4→1800 | A3→3600 |
| Oriflamme   | Standard: 2.8m→200k  | 3.5m→240k             | 4.5m→300k            |
| Panneau PVC | A1→40k               | A2→22k                | A3→15k               | A4→10k  | max→72k |
| T-Shirt     | Marquage DTF: A4→21k | Marquage Flex: A4→28k |

## Avantage Concurrentiel

- ✅ Fonctionne pour TOUS les produits (pas seulement Flyers)
- ✅ Plus jamais à refaire quand de nouveaux produits ajoutés
- ✅ Affiche tous les prix de toutes les variantes
- ✅ Implementation isolée (3 fichiers seulement)
- ✅ Compatible avec config existantes (unit, A4, per_m2, 2.8m, etc.)

## Critères de Sucess

- [ ] Tooltip s'affiche pour tout produit avec >=1 variante
- [ ] Tous les prix des variantes sont affichés
- [ ] Aucun régression sur produits à 1 variante
- [ ] Code TypeScript sans erreur

## Next Steps (Demain)

1. Ouvrir `task.md` et suivre les 3 étapes
2. Tester sur Flyers, Oriflamme, Panneau PVC
3. Vérifier visuellement sur navigateur

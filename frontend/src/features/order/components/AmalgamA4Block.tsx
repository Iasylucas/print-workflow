import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingRule {
  pricingMode: string;
  config: Record<string, number>;
}
interface Variant {
  id: number;
  name: string;
  pricingRules: PricingRule[];
}
interface Product {
  id: number;
  name: string;
  slug: string;
  variants: Variant[];
}

interface AmalgamA4BlockProps {
  products: Product[] | undefined;
}

export const AmalgamA4Block = ({ products }: AmalgamA4BlockProps) => {
  const laizeMachineA4 = 19;
  const longueurReferenceA4 = 27;
  const surfaceOneA4M2 = 0.06237;

  // 1. États de saisie de la calculatrice
  const [objectWidth, setObjectWidth] = useState<string>("5");
  const [objectHeight, setObjectHeight] = useState<string>("5");
  const [quantityWanted, setQuantityWanted] = useState<string>("100");

  // 2. États pour le choix du produit et le prix
  const [selectedProductSlug, setSelectedProductSlug] =
    useState<string>("flyers");
  const [faceMode, setFaceMode] = useState<"RECTO" | "RECTO_VERSO">("RECTO");
  const [overrideUnitPrice, setOverrideUnitPrice] = useState<string>("");

  // Filtrer les produits pour exclure le PVC de la liste
  // 🌟 FILTRAGE STRICT : On garde les formats feuilles mais on exclut explicitement le PVC et le DTF
  const filteredProducts = (products || []).filter((product: any) => {
    // 1. Condition d'exclusion par slug
    if (product.slug === "panneau-pvc" || product.slug === "metrage-dtf") {
      return false;
    }

    // 2. Condition d'inclusion par mode de tarification sur feuille
    return product.variants?.some((variant: any) =>
      variant.pricingRules?.some(
        (rule: any) =>
          rule.pricingMode === "FORMAT" ||
          rule.pricingMode === "RECTO_VERSO" ||
          rule.pricingMode === "PER_UNIT",
      ),
    );
  });

  // 🌟 DÉTERMINATION DYNAMIQUE VIA L'API SI LE RECTO/VERSO EST DISPONIBLE
  // 1. Trouver le produit sélectionné (Sécurisé avec un tableau vide par défaut)
  const currentProduct = filteredProducts.find(
    (p: any) => p.slug === selectedProductSlug,
  );

  // 🌟 CORRECTION ICI : Ajout du chaînage optionnel ?. sur variants et pricingRules
  // Détermine de manière 100% stable si le produit gère le recto/verso
  // 🌟 CORRECTION : On débloque si l'une des variantes contient le mot "verso" dans son nom
  const hasRectoVersoOptions =
    currentProduct?.variants?.some((v: any) =>
      v.name.toLowerCase().includes("verso"),
    ) ?? false;

  // Forcer le mode RECTO si le produit sélectionné ne gère pas le recto/verso
  // useEffect(() => {
  //   if (!hasRectoVersoOptions) {
  //     setFaceMode("RECTO");
  //   }
  // }, [hasRectoVersoOptions]);

  // 🌟 EXTRACTION DU PRIX UNIVERSELLE (PAR NOM DE VARIANTE)
  useEffect(() => {
    if (!currentProduct) return;

    let targetPrice = 0;

    if (hasRectoVersoOptions) {
      // On cherche précisément "recto verso" ou "recto" dans le nom de la variante (ex: "Recto Seul")
      const variantNameTarget =
        faceMode === "RECTO_VERSO" ? "recto verso" : "recto";
      const variant = currentProduct.variants.find((v: any) =>
        v.name.toLowerCase().includes(variantNameTarget),
      );

      const config = (variant?.pricingRules as any)?.[0]?.config;
      targetPrice = config?.["A4"] || config?.["unit"] || 0;
    } else {
      const firstVariant = currentProduct.variants?.[0];
      const config = (firstVariant?.pricingRules as any)?.[0]?.config;
      targetPrice = config?.["A4"] || config?.["unit"] || 0;
    }

    setOverrideUnitPrice(targetPrice.toString());
  }, [selectedProductSlug, faceMode, currentProduct, hasRectoVersoOptions]);

  // 🌟 CHARGEMENT AUTOMATIQUE DU PRIX DEPUIS LA DB PAR DÉFAUT
  useEffect(() => {
    if (!currentProduct) return;

    let targetPrice = 0;
    if (hasRectoVersoOptions) {
      const variantNameTarget =
        faceMode === "RECTO_VERSO" ? "recto verso" : "recto";
      const variant = currentProduct.variants.find((v) =>
        v.name.toLowerCase().includes(variantNameTarget),
      );
      // Extraction de la clé A4 ou unit dans le JSON config du backend
      const config = variant?.pricingRules?.[0]?.config;
      targetPrice = config?.["A4"] || config?.["unit"] || 0;
    } else {
      const firstVariant = currentProduct.variants[0];
      const config = firstVariant?.pricingRules?.[0]?.config;
      targetPrice = config?.["A4"] || config?.["unit"] || 0;
    }

    setOverrideUnitPrice(targetPrice.toString());
  }, [selectedProductSlug, faceMode, currentProduct, hasRectoVersoOptions]);

  // 3. LOGIQUE MATHÉMATIQUE DE L'AMALGAME
  const w = Number(objectWidth);
  const h = Number(objectHeight);
  const qty = Number(quantityWanted);
  const currentPriceA4 = Number(overrideUnitPrice) || 0;

  const rowLigne1 = w > 0 ? Number((laizeMachineA4 / w).toFixed(5)) : 0;
  const rowLigne2 = h > 0 ? Number((longueurReferenceA4 / h).toFixed(5)) : 0;

  // Calcul combiné exact style Excel avec la virgule, moins 1 de sécurité
  const totalPiecesPerA4 =
    w > 0 && h > 0
      ? Math.floor((laizeMachineA4 / w) * (longueurReferenceA4 / h) - 1)
      : 0;
  const sheetsA4Required =
    totalPiecesPerA4 > 0 && qty > 0 ? Math.ceil(qty / totalPiecesPerA4) : 0;
  const totalSurfaceM2 = Number((sheetsA4Required * surfaceOneA4M2).toFixed(3));

  // 🌟 CONFIGURATION DE LA MATRICE BASÉE STRICTEMENT SUR LA QUANTITÉ VOULUE
  // 🌟 REMPLACER UNIQUEMENT LE BLOC DE LA VARIABLE MATRIX :
  const matrix = {
    A4: {
      totalPcs: totalPiecesPerA4,
      sheets:
        totalPiecesPerA4 > 0 && qty > 0 ? Math.ceil(qty / totalPiecesPerA4) : 0,
      totalAr:
        totalPiecesPerA4 > 0 && qty > 0
          ? Math.ceil(qty / totalPiecesPerA4) * currentPriceA4
          : 0,
    },
    A3: {
      totalPcs: totalPiecesPerA4 * 2,
      sheets:
        totalPiecesPerA4 > 0 && qty > 0
          ? Math.ceil(qty / (totalPiecesPerA4 * 2))
          : 0,
      totalAr:
        totalPiecesPerA4 > 0 && qty > 0
          ? Math.ceil(qty / (totalPiecesPerA4 * 2)) * (currentPriceA4 * 2)
          : 0,
    },
    A2: {
      totalPcs: totalPiecesPerA4 * 4,
      sheets:
        totalPiecesPerA4 > 0 && qty > 0
          ? Math.ceil(qty / (totalPiecesPerA4 * 4))
          : 0,
      totalAr:
        totalPiecesPerA4 > 0 && qty > 0
          ? Math.ceil(qty / (totalPiecesPerA4 * 4)) * (currentPriceA4 * 4)
          : 0,
    },
    A1: {
      totalPcs: totalPiecesPerA4 * 8,
      sheets:
        totalPiecesPerA4 > 0 && qty > 0
          ? Math.ceil(qty / (totalPiecesPerA4 * 8))
          : 0,
      totalAr:
        totalPiecesPerA4 > 0 && qty > 0
          ? Math.ceil(qty / (totalPiecesPerA4 * 8)) * (currentPriceA4 * 8)
          : 0,
    },
  };

  const handleReset = () => {
    setObjectWidth("");
    setObjectHeight("");
    setQuantityWanted("");
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-xs space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary stroke-[2.5]" />
          <h3 className="font-bold text-foreground text-sm">
            Bloc 2 : Calcul par Feuille (A4 / A3 / A2 / A1)
          </h3>
        </div>
        <Button
          variant="ghost"
          onClick={handleReset}
          className="h-6 text-[10px] text-muted-foreground gap-1 px-2 hover:bg-muted"
        >
          <RotateCcw size={11} /> Reset
        </Button>
      </div>

      {/* SÉLECTEURS AUTOMATIQUES DYNAMIQUES */}
      <div className="grid grid-cols-3 gap-3 p-2.5 rounded-lg border border-border bg-muted/30 items-end">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Choisir Produit
          </Label>
          <select
            value={selectedProductSlug}
            onChange={(e) => setSelectedProductSlug(e.target.value)}
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-hidden"
          >
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Finition / Face
          </Label>
          <select
            disabled={!hasRectoVersoOptions}
            value={faceMode}
            onChange={(e) => setFaceMode(e.target.value as any)}
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-hidden disabled:bg-muted disabled:opacity-50"
          >
            <option value="RECTO">Recto Seul</option>
            <option value="RECTO_VERSO">Recto Verso</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Prix Réf A4 / Saisie libre (Ar)
          </Label>
          <Input
            type="number"
            value={overrideUnitPrice}
            onChange={(e) => setOverrideUnitPrice(e.target.value)}
            className="h-8 font-bold text-primary focus-visible:ring-0 bg-background"
          />
        </div>
      </div>

      {/* STRUCTURE DU TABLEUR */}
      {/* TABLEUR D'IMPOSITION A4 UNIQUE ET PROPRE */}
      <div className="border border-border rounded-md overflow-hidden bg-background">
        {/* En-tête des colonnes Excel */}
        <div className="grid grid-cols-5 bg-muted/60 p-2 font-semibold text-muted-foreground text-[10px] uppercase border-b border-border">
          <div>Format Réf.</div>
          <div>Dim. Objet (cm)</div>
          <div>Nb / Ligne</div>
          <div>Nb / Colonne</div>
          <div className="text-right">Total Utile (-1)</div>
        </div>

        {/* Unique Ligne de calcul fluide */}
        <div className="grid grid-cols-5 p-2 items-center gap-2">
          <div className="font-bold text-muted-foreground">A4 (19 × 27 cm)</div>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={objectWidth}
              onChange={(e) => setObjectWidth(e.target.value)}
              className="h-7 w-12 text-xs p-1 focus-visible:ring-0 font-medium"
              placeholder="L"
            />
            <span className="text-muted-foreground">×</span>
            <Input
              type="number"
              value={objectHeight}
              onChange={(e) => setObjectHeight(e.target.value)}
              className="h-7 w-12 text-xs p-1 focus-visible:ring-0 font-medium"
              placeholder="H"
            />
          </div>
          {/* Colonne Nb / Ligne */}
          <div className="font-mono font-medium pl-2">
            {w > 0 ? rowLigne1 : "-"}
          </div>

          {/* Colonne Nb / Colonne */}
          <div className="font-mono font-medium pl-2">
            {h > 0 ? rowLigne2 : "-"}
          </div>

          <div className="text-right font-black text-primary pr-2">
            {totalPiecesPerA4 > 0 ? `${totalPiecesPerA4} pcs` : "-"}
          </div>
        </div>
      </div>
      {/* 🌟 À INSERER POUR LA SAISIE DE LA QUANTITÉ VOULUE */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-primary">
          Quantité voulue
        </Label>
        <Input
          type="number"
          min={1}
          value={quantityWanted}
          onChange={(e) => setQuantityWanted(e.target.value)}
          className="h-8 text-xs font-bold border-primary/40 focus-visible:ring-0"
          placeholder="Ex: 100"
        />
      </div>

      {/* LA MATRICE AUTOMATIQUE QUI SUIT LA MODIFICATION DU PRIX */}
      <div className="border border-border rounded-md overflow-hidden bg-background mt-2">
        <div className="grid grid-cols-4 bg-primary/5 p-2 font-bold text-primary text-[10px] uppercase border-b border-border tracking-wider">
          <div>Type de Feuille</div>
          <div>Total Pièces / Feuille</div>
          <div>Feuilles Requises</div>
          <div className="text-right">Prix Estimation</div>
        </div>

        {Object.entries(matrix).map(([formatKey, val]) => (
          <div
            key={formatKey}
            className={cn(
              "grid grid-cols-4 p-2 items-center border-b last:border-0 border-border/60 text-[11px] font-medium",
              formatKey === "A4" ? "bg-background" : "bg-muted/10",
            )}
          >
            <div className="font-bold text-foreground uppercase">
              {formatKey}
            </div>
            <div className="font-mono text-muted-foreground">
              {totalPiecesPerA4 > 0 ? `${val.totalPcs} pcs` : "-"}
            </div>
            <div className="font-bold text-foreground">
              {totalPiecesPerA4 > 0 ? `${val.sheets} feuilles` : "-"}
            </div>
            <div className="text-right font-black text-primary pr-1">
              {totalPiecesPerA4 > 0
                ? `${val.totalAr.toLocaleString()} Ar`
                : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, PlusCircle, RotateCcw } from "lucide-react";

interface PriceCalculationBlockProps {
  products: any[] | undefined;
  onAddOrderLine: (line: {
    designation: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    widthCm: number | null;
    heightCm: number | null;
    options: Record<string, string | number | boolean>;
  }) => void;
}

export const PriceCalculationBlock = ({
  products,
  onAddOrderLine,
}: PriceCalculationBlockProps) => {
  // États de saisie
  const [customLengthM, setCustomLengthM] = useState<string>("0.7");
  const [customQuantity, setCustomQuantity] = useState<string>("1");
  const [priceNoCutPerM2, setPriceNoCutPerM2] = useState<string>("");

  // Extraction du prix catalogue (mémorisé)
  const fetchedPrice = useMemo(() => {
    if (!products || !Array.isArray(products)) return 0;
    const vinyleProduct = products.find((p) => p.slug === "vinyle-autocollant");
    const variant = vinyleProduct?.variants?.find(
      (v: any) =>
        v.name.toLowerCase().includes("sans") ||
        v.name.toLowerCase().includes("découpe"),
    );
    const firstRule = variant?.pricingRules?.[0];
    const config = firstRule?.config as Record<string, number> | undefined;
    return config?.["per_m2"] || 18000;
  }, [products]);

  // Mise à jour du prix uniquement si vide
  useMemo(() => {
    if (priceNoCutPerM2 === "" && fetchedPrice > 0) {
      setPriceNoCutPerM2(fetchedPrice.toString());
    }
  }, [fetchedPrice, priceNoCutPerM2]);

  // Calculs
  const lengthM = Number(customLengthM) || 0;
  const qty = Number(customQuantity) || 0;
  const currentPricePerM2 = Number(priceNoCutPerM2) || 0;

  const surfaceM2 = 1.5 * lengthM;
  const unitPrice = Math.round(surfaceM2 * currentPricePerM2);
  const totalPrice = unitPrice * qty;

  const handlePushToCart = () => {
    if (totalPrice <= 0) return;
    onAddOrderLine({
      designation: `Impression Grand Format brut sans découpe (Laize 1.5m × ${lengthM}m)`,
      quantity: qty,
      unitPrice,
      totalPrice,
      widthCm: 150,
      heightCm: Math.round(lengthM * 100),
      options: { mode: "NO_CUT", surfaceM2Calculated: surfaceM2 },
    });
  };

  const handleReset = () => {
    setCustomLengthM("0.7");
    setCustomQuantity("1");
    setPriceNoCutPerM2("");
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-xs space-y-4 font-sans text-xs">
      {/* En-tête avec reset */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary stroke-[2.5]" />
          <h3 className="font-bold text-foreground text-sm">
            Bloc 3 : Rouleau Grand Format (Sans Découpe)
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

      {/* TABLEUR EXCEL */}
      <div className=" overflow-hidden bg-background">
        <div className="grid grid-cols-3 bg-muted/50 p-2 border-b border-border font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
          <div>Dimension (m)</div>
          <div>Prix m² / Saisie libre</div>
          <div className="text-right">Total Ligne</div>
        </div>

        <div className="grid grid-cols-3 p-2.5 items-center gap-4">
          {/* Colonne 1 : Dimension */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-muted-foreground font-medium">
              Laize fixe :{" "}
              <span className="text-foreground font-bold">1.50 m</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground font-medium text-[11px]">
                H (m) :
              </span>
              <Input
                type="number"
                value={customLengthM}
                onChange={(e) => setCustomLengthM(e.target.value)}
                className="h-7 w-20 text-xs px-1.5 font-medium focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Colonne 2 : Prix + Quantité */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={priceNoCutPerM2}
                onChange={(e) => setPriceNoCutPerM2(e.target.value)}
                className="h-7 w-24 text-xs font-bold text-primary focus-visible:ring-0 bg-background"
                placeholder="Auto"
              />
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                Ar/m²
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground font-medium text-[10px]">
                Quantité :
              </span>
              <Input
                type="number"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                className="h-6 w-12 text-xs p-1 focus-visible:ring-0 text-center font-medium"
              />
            </div>
          </div>

          {/* Colonne 3 : Total */}
          <div className="text-right">
            <div className="font-black text-primary text-sm tracking-tight">
              {totalPrice.toLocaleString()} Ar
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              ({qty} {qty > 1 ? "unités" : "unité"})
            </span>
          </div>
        </div>
      </div>

      {/* Bouton Ajouter */}
      <div className="flex justify-end pt-1">
        <Button
          onClick={handlePushToCart}
          disabled={totalPrice <= 0}
          className="h-8 font-semibold text-xs bg-primary hover:bg-primary/90 text-background px-4 gap-1.5 shadow-xs"
        >
          <PlusCircle size={13} /> Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Calculator,
//   Scissors,
//   EyeOff,
//   Keyboard,
//   PlusCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface PriceCalculationBlockProps {
//   onAddOrderLine: (line: {
//     designation: string;
//     quantity: number;
//     unitPrice: number;
//     totalPrice: number;
//     widthCm: number | null;
//     heightCm: number | null;
//     options: Record<string, string | number | boolean>;
//   }) => void;
// }

// export const PriceCalculationBlock = ({
//   onAddOrderLine,
// }: PriceCalculationBlockProps) => {
//   // Sélection manuelle stricte par le commercial
//   const [calculationMode, setCalculationMode] = useState<
//     "WITH_CUT" | "NO_CUT" | "MANUAL"
//   >("WITH_CUT");

//   // Paramètres du tableau Excel (Mètres pour Grand Format)
//   const [customLengthM, setCustomLengthM] = useState<string>("0.7");
//   const [customQuantity, setCustomQuantity] = useState<string>("1");
//   const [manualPrice, setManualPrice] = useState<string>("0");

//   // Tarifs fixes issus du catalogue d'imprimerie
//   const priceWithCutPerM2 = 22000;
//   const priceNoCutPerM2 = 18000;

//   const lengthM = Number(customLengthM);
//   const qty = Number(customQuantity);
//   const currentPricePerM2 =
//     calculationMode === "WITH_CUT" ? priceWithCutPerM2 : priceNoCutPerM2;

//   let unitPrice = 0;
//   let designation = "";

//   if (calculationMode === "MANUAL") {
//     unitPrice = Number(manualPrice);
//     designation = "Impression Grand Format (Prix libre manuel)";
//   } else {
//     // Calcul classique de surface de rouleau : Laize fixe 1.5m * Longueur saisie
//     const surfaceM2 = 1.5 * lengthM;
//     unitPrice = Math.round(surfaceM2 * currentPricePerM2);
//     designation =
//       calculationMode === "WITH_CUT"
//         ? `Impression Grand Format avec découpe (Laize 1.5m × ${lengthM}m)`
//         : `Impression Grand Format brut sans découpe (Laize 1.5m × ${lengthM}m)`;
//   }

//   const totalPrice = unitPrice * qty;

//   const handlePushToCart = () => {
//     onAddOrderLine({
//       designation,
//       quantity: qty,
//       unitPrice,
//       totalPrice,
//       widthCm: 150,
//       heightCm: Math.round(lengthM * 100),
//       options: { mode: calculationMode },
//     });
//   };

//   return (
//     <div className="rounded-lg border border-border bg-background p-4 shadow-xs space-y-4 font-sans text-xs">
//       <div className="flex items-center gap-2 pb-2 border-b border-border">
//         <Calculator className="h-4 w-4 text-primary stroke-[2.5]" />
//         <h3 className="font-bold text-foreground text-sm">
//           Bloc 3 : Moteur de facturation par dimension (m)
//         </h3>
//       </div>

//       {/* Sélection de l'action par le commercial */}
//       <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-muted/60">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setCalculationMode("WITH_CUT")}
//           className={cn(
//             "h-7 text-[11px] font-medium rounded-md gap-1",
//             calculationMode === "WITH_CUT"
//               ? "bg-background shadow-xs text-foreground font-semibold"
//               : "text-muted-foreground",
//           )}
//         >
//           <Scissors size={12} /> Avec Découpe
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setCalculationMode("NO_CUT")}
//           className={cn(
//             "h-7 text-[11px] font-medium rounded-md gap-1",
//             calculationMode === "NO_CUT"
//               ? "bg-background shadow-xs text-foreground font-semibold"
//               : "text-muted-foreground",
//           )}
//         >
//           <EyeOff size={12} /> Sans Découpe
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setCalculationMode("MANUAL")}
//           className={cn(
//             "h-7 text-[11px] font-medium rounded-md gap-1",
//             calculationMode === "MANUAL"
//               ? "bg-background shadow-xs text-foreground font-semibold"
//               : "text-muted-foreground",
//           )}
//         >
//           <Keyboard size={12} /> Saisie Manuelle
//         </Button>
//       </div>

//       {/* TABLEUR EXCEL INDÉPENDANT : DIMENSION (M) | PRIX M² | TOTAL */}
//       <div className="border border-border rounded-md overflow-hidden bg-background">
//         <div className="grid grid-cols-3 bg-muted/50 p-2 border-b border-border font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
//           <div>Dimension (m)</div>
//           <div>Prix m² / Saisie libre</div>
//           <div className="text-right">Total Ligne</div>
//         </div>

//         <div className="grid grid-cols-3 p-2.5 items-center gap-4">
//           {/* Colonne 1 : Dimension Laize Machine */}
//           <div className="space-y-1.5">
//             <div className="text-[11px] text-muted-foreground font-medium">
//               Laize fixe :{" "}
//               <span className="text-foreground font-bold">1.50 m</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="text-muted-foreground font-medium text-[11px]">
//                 H (m) :
//               </span>
//               <Input
//                 type="number"
//                 disabled={calculationMode === "MANUAL"}
//                 value={customLengthM}
//                 onChange={(e) => setCustomLengthM(e.target.value)}
//                 className="h-7 w-20 text-xs px-1.5 font-medium focus-visible:ring-0"
//               />
//             </div>
//           </div>

//           {/* Colonne 2 : Grille Tarifaire / Quantité */}
//           <div className="space-y-1.5">
//             {calculationMode === "MANUAL" ? (
//               <Input
//                 type="number"
//                 value={manualPrice}
//                 onChange={(e) => setManualPrice(e.target.value)}
//                 className="h-7 w-full text-xs font-bold text-primary focus-visible:ring-0"
//                 placeholder="Ariary entier"
//               />
//             ) : (
//               <div className="font-bold text-foreground text-xs">
//                 {currentPricePerM2.toLocaleString()}{" "}
//                 <span className="text-[10px] font-normal text-muted-foreground">
//                   Ar/m²
//                 </span>
//               </div>
//             )}

//             <div className="flex items-center gap-1">
//               <span className="text-muted-foreground font-medium text-[10px]">
//                 Quantité :
//               </span>
//               <Input
//                 type="number"
//                 value={customQuantity}
//                 onChange={(e) => setCustomQuantity(e.target.value)}
//                 className="h-6 w-12 text-xs p-1 focus-visible:ring-0 text-center font-medium"
//               />
//             </div>
//           </div>

//           {/* Colonne 3 : Total de la ligne comptable */}
//           <div className="text-right">
//             <div className="font-black text-primary text-sm tracking-tight">
//               {totalPrice.toLocaleString()} Ar
//             </div>
//             <span className="text-[10px] text-muted-foreground font-medium">
//               ({qty} {qty > 1 ? "unités" : "unité"})
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Bouton direct d'empilement dans le panier */}
//       <div className="flex justify-end pt-1">
//         <Button
//           onClick={handlePushToCart}
//           disabled={totalPrice <= 0}
//           className="h-8 font-semibold text-xs bg-primary hover:bg-primary/90 text-background px-4 gap-1.5 shadow-xs"
//         >
//           <PlusCircle size={13} /> Ajouter au panier
//         </Button>
//       </div>
//     </div>
//   );
// };

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, RotateCcw, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================
// 1. FONCTIONS DE CALCUL PURES (indépendantes du composant)
// ============================================================
const MACHINE_WIDTH = 148; // cm
const MACHINE_REF_LENGTH = 68; // cm

const computeRowLigne = (machineDimension: number, objectDimension: number) =>
  objectDimension > 0
    ? Number((machineDimension / objectDimension).toFixed(5))
    : 0;

const computeTotalPieces = (width: number, height: number) => {
  if (width <= 0 || height <= 0) return 0;
  return Math.floor(
    (MACHINE_WIDTH / width) * (MACHINE_REF_LENGTH / height) - 1,
  );
};

const computeRequiredSurface = (piecesPerM2: number, quantity: number) => {
  if (piecesPerM2 <= 0 || quantity <= 0) return 0;
  const raw = quantity / piecesPerM2;
  const intPart = Math.floor(raw);
  const decPart = raw - intPart;
  if (decPart === 0) return intPart;
  if (decPart <= 0.5) return intPart + 0.5;
  return Math.ceil(raw);
};

const computeTotalPrice = (surface: number, pricePerM2: number) =>
  surface * pricePerM2;

// ============================================================
// 2. COMPOSANT
// ============================================================
interface AmalgamM2BlockProps {
  products?: Array<{ slug: string; variants: any[] }>;
  isLoading?: boolean;
}

export const AmalgamM2Block = ({
  products,
  isLoading,
}: AmalgamM2BlockProps) => {
  // États de saisie (uniquement les données brutes)
  const [objectWidth, setObjectWidth] = useState<number | "">(10);
  const [objectHeight, setObjectHeight] = useState<number | "">(12);
  const [quantityWanted, setQuantityWanted] = useState<number | "">(500);
  const [pricePerM2, setPricePerM2] = useState<number | "">("");

  // ============================================================
  // 3. EXTRACTION DU PRIX CATALOGUE (mémorisé)
  // ============================================================
  const fetchedPrice = useMemo(() => {
    if (!products || isLoading) return 0;
    const vinyle = products.find((p) => p.slug === "vinyle-autocollant");
    const variant = vinyle?.variants?.find((v: any) =>
      v.name.toLowerCase().includes("découpé"),
    );
    const config = variant?.pricingRules?.[0]?.config as
      | Record<string, number>
      | undefined;
    return config?.["per_m2"] || 0;
  }, [products, isLoading]);

  // Si le prix n'a pas été modifié manuellement, on le met à jour avec le prix catalogue
  // (on utilise useMemo pour éviter un effet de bord)
  const effectivePrice = useMemo(() => {
    if (pricePerM2 === "" && fetchedPrice > 0) return fetchedPrice;
    if (typeof pricePerM2 === "number") return pricePerM2;
    return 0;
  }, [pricePerM2, fetchedPrice]);

  // ============================================================
  // 4. CALCULS DÉRIVÉS (mémorisés)
  // ============================================================
  const width = typeof objectWidth === "number" ? objectWidth : 0;
  const height = typeof objectHeight === "number" ? objectHeight : 0;
  const quantity = typeof quantityWanted === "number" ? quantityWanted : 0;

  const rowLigneW = useMemo(
    () => computeRowLigne(MACHINE_WIDTH, width),
    [width],
  );
  const rowLigneH = useMemo(
    () => computeRowLigne(MACHINE_REF_LENGTH, height),
    [height],
  );
  const piecesPerM2 = useMemo(
    () => computeTotalPieces(width, height),
    [width, height],
  );
  const requiredSurface = useMemo(
    () => computeRequiredSurface(piecesPerM2, quantity),
    [piecesPerM2, quantity],
  );
  const totalPrice = useMemo(
    () => computeTotalPrice(requiredSurface, effectivePrice),
    [requiredSurface, effectivePrice],
  );

  // ============================================================
  // 5. HANDLERS
  // ============================================================
  const handleReset = () => {
    setObjectWidth(10);
    setObjectHeight(12);
    setQuantityWanted(500);
    setPricePerM2("");
  };

  // ============================================================
  // 6. RENDU
  // ============================================================
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">
            Bloc 1 : Calcul par m² (Stickers)
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Calcule le nombre de stickers possibles par m² à partir des
                dimensions, puis estime la surface et le prix total.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="gap-1 text-xs h-7"
        >
          <RotateCcw className="h-3 w-3" />
          Réinitialiser
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 text-xs">
        {/* --- En-tête du tableau type Excel --- */}
        <div className="grid grid-cols-5 gap-2 items-center p-1.5 bg-muted/30 rounded-t-md border-b border-border font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
          <div>Largeur machine</div>
          <div>Dimension objet</div>
          <div className="text-center">Lignes / Colonnes</div>
          <div className="text-center">Pièces / m²</div>
          <div className="text-right">Quantité</div>
        </div>

        {/* --- Ligne 1 : Largeur machine --- */}
        <div className="grid grid-cols-5 gap-2 items-center p-1.5 bg-background rounded-b-md">
          <div className="font-semibold text-foreground">
            {MACHINE_WIDTH} cm
          </div>
          <div>
            <Input
              type="number"
              value={objectWidth}
              onChange={(e) => setObjectWidth(parseFloat(e.target.value) || "")}
              className="h-7 w-20 text-xs px-2"
              placeholder="Largeur"
            />
          </div>
          <div className="text-center font-mono font-medium">
            {rowLigneW || "-"}
          </div>
          <div className="text-center font-mono font-medium">
            {piecesPerM2 || "-"}
          </div>
          <div className="text-right">
            <Input
              type="number"
              value={quantityWanted}
              onChange={(e) =>
                setQuantityWanted(parseFloat(e.target.value) || "")
              }
              className="h-7 w-24 text-xs px-2 text-right"
              placeholder="Qté"
            />
          </div>
        </div>

        {/* --- Ligne 2 : Longueur référence --- */}
        <div className="grid grid-cols-5 gap-2 items-center p-1.5 bg-muted/10 rounded-b-md">
          <div className="font-semibold text-foreground">
            {MACHINE_REF_LENGTH} cm
          </div>
          <div>
            <Input
              type="number"
              value={objectHeight}
              onChange={(e) =>
                setObjectHeight(parseFloat(e.target.value) || "")
              }
              className="h-7 w-20 text-xs px-2"
              placeholder="Hauteur"
            />
          </div>
          <div className="text-center font-mono font-medium">
            {rowLigneH || "-"}
          </div>
          {/* Cellule vide pour aligner avec la colonne Pièces/m² de la ligne 1 */}
          <div></div>
          <div className="text-right">
            <div className="inline-block px-3 py-0.5 bg-primary/10 rounded-full text-primary font-bold text-xs">
              {requiredSurface > 0 ? `${requiredSurface} m²` : "-"}
            </div>
          </div>
        </div>

        {/* --- Ligne prix m² (modifiable) --- */}
        <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-dashed border-border">
          <div className="flex items-center gap-2">
            <Label className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
              Prix m² (Ar)
            </Label>
            <Input
              type="number"
              value={effectivePrice || ""}
              onChange={(e) => setPricePerM2(parseFloat(e.target.value) || "")}
              className="h-7 text-xs font-medium text-primary bg-background flex-1"
              placeholder="Auto"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <span className="text-[10px] text-muted-foreground">
              Total estimé
            </span>
            <span className="text-sm font-bold text-primary">
              {totalPrice.toLocaleString()}{" "}
              <span className="text-[10px] font-medium">Ar</span>
            </span>
            {effectivePrice > 0 && requiredSurface > 0 && (
              <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">
                ({requiredSurface} m² × {effectivePrice.toLocaleString()})
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
// // src/features/pos/components/AmalgamM2Block.tsx
// import { useMemo, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Layers, RotateCcw, Info } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Skeleton } from "@/components/ui/skeleton";

// // --- Constantes machine (simulées) ---
// const MACHINE_WIDTH = 148; // cm
// const MACHINE_REF_LENGTH = 68; // cm

// // --- Fonctions de calcul pures (faciles à tester) ---
// const computeRowLigne = (machineDimension: number, objectDimension: number) =>
//   objectDimension > 0 ? Number((machineDimension / objectDimension).toFixed(5)) : 0;

// const computeTotalPieces = (width: number, height: number) => {
//   if (width <= 0 || height <= 0) return 0;
//   return Math.floor((MACHINE_WIDTH / width) * (MACHINE_REF_LENGTH / height) - 1);
// };

// const computeRequiredSurface = (piecesPerM2: number, quantity: number) => {
//   if (piecesPerM2 <= 0 || quantity <= 0) return 0;
//   const raw = quantity / piecesPerM2;
//   const integerPart = Math.floor(raw);
//   const decimalPart = raw - integerPart;
//   if (decimalPart === 0) return integerPart;
//   if (decimalPart <= 0.5) return integerPart + 0.5;
//   return Math.ceil(raw);
// };

// const computeTotalPrice = (surface: number, pricePerM2: number) => surface * pricePerM2;

// // --- Composant principal ---
// interface AmalgamM2BlockProps {
//   products?: Array<{ slug: string; variants: any[] }>;
//   isLoading?: boolean;
// }

// export const AmalgamM2Block = ({ products, isLoading }: AmalgamM2BlockProps) => {
//   // États de saisie
//   const [objectWidth, setObjectWidth] = useState<number | "">(10);
//   const [objectHeight, setObjectHeight] = useState<number | "">(12);
//   const [quantityWanted, setQuantityWanted] = useState<number | "">(500);
//   const [pricePerM2, setPricePerM2] = useState<number | "">("");

//   // --- Chargement du prix depuis le catalogue ---
//   const fetchedPrice = useMemo(() => {
//     if (!products || isLoading) return 0;
//     const vinyle = products.find((p) => p.slug === "vinyle-autocollant");
//     const variant = vinyle?.variants?.find((v: any) =>
//       v.name.toLowerCase().includes("découpé")
//     );
//     const config = variant?.pricingRules?.[0]?.config as Record<string, number> | undefined;
//     return config?.["per_m2"] || 0;
//   }, [products, isLoading]);

//   // Mise à jour du prix automatique uniquement si l'utilisateur n'a pas saisi manuellement
//   useMemo(() => {
//     if (pricePerM2 === "" && fetchedPrice > 0) {
//       setPricePerM2(fetchedPrice);
//     }
//   }, [fetchedPrice, pricePerM2]);

//   // --- Calculs dérivés (mémorisés) ---
//   const width = typeof objectWidth === "number" ? objectWidth : 0;
//   const height = typeof objectHeight === "number" ? objectHeight : 0;
//   const quantity = typeof quantityWanted === "number" ? quantityWanted : 0;
//   const price = typeof pricePerM2 === "number" ? pricePerM2 : 0;

//   const rowLigneWidth = computeRowLigne(MACHINE_WIDTH, width);
//   const rowLigneHeight = computeRowLigne(MACHINE_REF_LENGTH, height);
//   const piecesPerM2 = computeTotalPieces(width, height);
//   const requiredSurface = computeRequiredSurface(piecesPerM2, quantity);
//   const totalPrice = computeTotalPrice(requiredSurface, price);

//   // --- Handlers ---
//   const handleReset = () => {
//     setObjectWidth(10);
//     setObjectHeight(12);
//     setQuantityWanted(500);
//     setPricePerM2(fetchedPrice);
//   };

//   // --- Rendu ---
//   if (isLoading) {
//     return (
//       <Card className="p-4 space-y-3">
//         <Skeleton className="h-6 w-1/3" />
//         <Skeleton className="h-24 w-full" />
//         <Skeleton className="h-10 w-full" />
//       </Card>
//     );
//   }

//   return (
//     <Card className="border-border bg-card shadow-sm">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <div className="flex items-center gap-2">
//           <Layers className="h-5 w-5 text-primary" />
//           <CardTitle className="text-sm font-semibold">
//             Bloc 1 : Calcul par m² (Stickers)
//           </CardTitle>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger>
//                 <Info className="h-4 w-4 text-muted-foreground" />
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p className="text-xs max-w-xs">
//                   Calcule le nombre de stickers possibles par m² à partir des dimensions de l'objet,
//                   puis estime la surface et le prix total.
//                 </p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//         <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs">
//           <RotateCcw className="h-3 w-3" />
//           Réinitialiser
//         </Button>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {/* Grille des dimensions machine / objet */}
//         <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-2 bg-muted/20 rounded-lg">
//           <div className="col-span-1">
//             <Label className="text-xs text-muted-foreground">Largeur machine (cm)</Label>
//             <div className="text-sm font-semibold text-primary">{MACHINE_WIDTH}</div>
//           </div>
//           <div className="col-span-1">
//             <Label className="text-xs text-muted-foreground">Longueur ref. (cm)</Label>
//             <div className="text-sm font-semibold text-primary">{MACHINE_REF_LENGTH}</div>
//           </div>
//         </div>

//         {/* Saisies dimensions objet */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-1">
//             <Label className="text-xs font-medium">Largeur objet (cm)</Label>
//             <Input
//               type="number"
//               value={objectWidth}
//               onChange={(e) => setObjectWidth(parseFloat(e.target.value) || "")}
//               className="h-8 text-xs"
//               placeholder="ex: 10"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label className="text-xs font-medium">Hauteur objet (cm)</Label>
//             <Input
//               type="number"
//               value={objectHeight}
//               onChange={(e) => setObjectHeight(parseFloat(e.target.value) || "")}
//               className="h-8 text-xs"
//               placeholder="ex: 12"
//             />
//           </div>
//         </div>

//         {/* Résultats des lignes / colonnes */}
//         <div className="grid grid-cols-2 gap-2 p-2 bg-background border rounded-md text-xs">
//           <div>
//             <span className="text-muted-foreground">Lignes / colonnes (largeur)</span>
//             <div className="font-mono font-medium">{rowLigneWidth || "-"}</div>
//           </div>
//           <div>
//             <span className="text-muted-foreground">Lignes / colonnes (hauteur)</span>
//             <div className="font-mono font-medium">{rowLigneHeight || "-"}</div>
//           </div>
//           <div className="col-span-2 text-right text-primary font-bold text-sm">
//             Total pièces / m² : {piecesPerM2 > 0 ? piecesPerM2 : "-"}
//           </div>
//         </div>

//         {/* Quantité et surface */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-1">
//             <Label className="text-xs font-medium">Quantité souhaitée</Label>
//             <Input
//               type="number"
//               value={quantityWanted}
//               onChange={(e) => setQuantityWanted(parseFloat(e.target.value) || "")}
//               className="h-8 text-xs"
//               placeholder="ex: 500"
//             />
//           </div>
//           <div className="flex flex-col justify-end p-2 bg-primary/5 rounded-lg border border-primary/10">
//             <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
//               Surface requise
//             </span>
//             <span className="text-base font-bold text-primary">
//               {requiredSurface > 0 ? requiredSurface : "-"} m²
//             </span>
//           </div>
//         </div>

//         {/* Prix m² */}
//         <div className="space-y-1">
//           <Label className="text-xs font-medium">Prix au m² (Ar)</Label>
//           <Input
//             type="number"
//             value={pricePerM2}
//             onChange={(e) => setPricePerM2(parseFloat(e.target.value) || "")}
//             className="h-8 text-xs font-medium text-primary bg-background"
//             placeholder="Chargé automatiquement depuis le catalogue"
//           />
//         </div>

//         {/* Total financier */}
//         <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
//           <div>
//             <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
//               Total estimé (avec découpe)
//             </span>
//             <div className="text-lg font-black text-primary tracking-tight">
//               {totalPrice.toLocaleString()} <span className="text-xs font-bold">Ar</span>
//             </div>
//             {price > 0 && requiredSurface > 0 && (
//               <span className="text-[10px] text-muted-foreground">
//                 {requiredSurface} m² × {price.toLocaleString()} Ar
//               </span>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
// src/features/pos/components/AmalgamM2Block.tsx

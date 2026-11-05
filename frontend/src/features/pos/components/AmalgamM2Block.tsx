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
import type { Product, ProductVariant } from "@/shared/types/product.types";

const MACHINE_WIDTH = 148;
const MACHINE_REF_LENGTH = 68;

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

interface AmalgamM2BlockProps {
  products?: Product[];
  isLoading?: boolean;
}

export const AmalgamM2Block = ({
  products,
  isLoading,
}: AmalgamM2BlockProps) => {
  const [objectWidth, setObjectWidth] = useState<number | "">(10);
  const [objectHeight, setObjectHeight] = useState<number | "">(12);
  const [quantityWanted, setQuantityWanted] = useState<number | "">(500);
  const [pricePerM2, setPricePerM2] = useState<number | "">("");
  const [requiredSurfaceInput, setRequiredSurfaceInput] = useState<number | "">(
    "",
  );
  const [calculationMode, setCalculationMode] = useState<
    "quantity" | "surface"
  >("quantity");

  const fetchedPrice = useMemo(() => {
    if (!products || isLoading) return 0;
    const vinyle = products.find((p) => p.slug === "vinyle-autocollant");
    const variant = vinyle?.variants?.find((v: ProductVariant) =>
      v.name.toLowerCase().includes("découpé"),
    );
    const config = variant?.pricingRules?.[0]?.config as
      | Record<string, number>
      | undefined;
    return config?.["per_m2"] || 0;
  }, [products, isLoading]);

  const effectivePrice = useMemo(() => {
    if (pricePerM2 === "" && fetchedPrice > 0) return fetchedPrice;
    if (typeof pricePerM2 === "number") return pricePerM2;
    return 0;
  }, [pricePerM2, fetchedPrice]);

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

  const handleReset = () => {
    setObjectWidth(10);
    setObjectHeight(12);
    setQuantityWanted(500);
    setPricePerM2("");
  };

  // Quantité effective (soit saisie, soit calculée depuis la surface)
  const effectiveQuantity = useMemo(() => {
    if (calculationMode === "surface" && requiredSurfaceInput !== "") {
      const surface = Number(requiredSurfaceInput);
      if (surface > 0 && piecesPerM2 > 0) {
        return Math.round(surface * piecesPerM2);
      }
    }
    return typeof quantityWanted === "number" ? quantityWanted : 0;
  }, [calculationMode, requiredSurfaceInput, quantityWanted, piecesPerM2]);

  // Surface effective (soit calculée depuis la quantité, soit saisie)
  const effectiveSurface = useMemo(() => {
    if (calculationMode === "surface" && requiredSurfaceInput !== "") {
      return Number(requiredSurfaceInput);
    }
    return computeRequiredSurface(piecesPerM2, effectiveQuantity);
  }, [calculationMode, requiredSurfaceInput, effectiveQuantity, piecesPerM2]);

  const handleQuantityChange = (value: number | "") => {
    setQuantityWanted(value);
    setCalculationMode("quantity");
    // La surface sera recalculée via useMemo
  };

  const handleSurfaceChange = (value: number | "") => {
    setRequiredSurfaceInput(value);
    setCalculationMode("surface");
    // La quantité sera recalculée via useMemo
  };

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
        <div className="grid grid-cols-5 gap-2 items-center p-1.5 bg-muted/30 rounded-t-md border-b border-border font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
          <div>Largeur machine</div>
          <div>Dimension objet</div>
          <div className="text-center">Lignes / Colonnes</div>
          <div className="text-center">Pièces / m²</div>
          <div className="text-right">Quantité</div>
        </div>

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
            {/* <Input
              type="number"
              value={quantityWanted}
              onChange={(e) =>
                setQuantityWanted(parseFloat(e.target.value) || "")
              }
              className="h-7 w-24 text-xs px-2 text-right"
              placeholder="Qté"
            /> */}
            <Input
              type="number"
              value={
                calculationMode === "surface"
                  ? effectiveQuantity
                  : quantityWanted
              }
              onChange={(e) =>
                handleQuantityChange(parseFloat(e.target.value) || "")
              }
              className="h-7 w-24 text-xs px-2 text-right"
              placeholder="Qté"
            />
          </div>
        </div>

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

          <div></div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-muted-foreground">m²</span>
            <Input
              type="number"
              value={
                calculationMode === "surface"
                  ? requiredSurfaceInput
                  : effectiveSurface
              }
              onChange={(e) =>
                handleSurfaceChange(parseFloat(e.target.value) || "")
              }
              className="h-7 w-20 text-xs px-2 text-right"
              placeholder="m²"
            />
          </div>
        </div>

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

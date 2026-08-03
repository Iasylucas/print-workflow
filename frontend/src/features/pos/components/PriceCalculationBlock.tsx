import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw } from "lucide-react";
import type { Product } from "@/shared/types/product.types";

interface PriceCalculationBlockProps {
  products: Product[];
}

export const PriceCalculationBlock = ({
  products,
}: PriceCalculationBlockProps) => {
  const [customLengthM, setCustomLengthM] = useState<string>("0.7");
  const [customQuantity, setCustomQuantity] = useState<string>("1");
  const [manualPrice, setManualPrice] = useState<string | null>(null);

  const fetchedPrice = useMemo(() => {
    if (!products || !Array.isArray(products)) return 0;
    const vinyleProduct = products.find((p) => p.slug === "vinyle-autocollant");
    const variant = vinyleProduct?.variants?.find(
      (v) =>
        v.name.toLowerCase().includes("sans") ||
        v.name.toLowerCase().includes("découpe"),
    );
    const firstRule = variant?.pricingRules?.[0];
    const config = firstRule?.config as Record<string, number> | undefined;
    return config?.["per_m2"] || 18000;
  }, [products]);

  const displayPrice = manualPrice ?? fetchedPrice.toString();
  const currentPricePerM2 = Number(displayPrice) || 0;

  const lengthM = Number(customLengthM) || 0;
  const qty = Number(customQuantity) || 0;

  const surfaceM2 = 1.5 * lengthM;
  const unitPrice = Math.round(surfaceM2 * currentPricePerM2);
  const totalPrice = unitPrice * qty;

  const handleReset = () => {
    setCustomLengthM("0.7");
    setCustomQuantity("1");
    setManualPrice(null);
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-xs space-y-4 font-sans text-xs">
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
          <RotateCcw size={11} /> Réinitialiser
        </Button>
      </div>

      <div className=" overflow-hidden bg-background">
        <div className="grid grid-cols-3 bg-muted/50 p-2 border-b border-border font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
          <div>Dimension (m)</div>
          <div>Prix m² / Saisie libre</div>
          <div className="text-right">Total Ligne</div>
        </div>

        <div className="grid grid-cols-3 p-2.5 items-center gap-4">
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

          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={displayPrice}
                onChange={(e) => setManualPrice(e.target.value)}
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
    </div>
  );
};

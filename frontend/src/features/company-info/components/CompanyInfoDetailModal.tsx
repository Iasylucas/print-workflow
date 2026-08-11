import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, MapPin, Banknote, Clock } from "lucide-react";
import type { CompanyInfo } from "../types/company.types";

interface CompanyInfoDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  version: CompanyInfo | null;
  isLoading: boolean;
}

export const CompanyInfoDetailModal = ({
  isOpen,
  onOpenChange,
  version,
  isLoading,
}: CompanyInfoDetailModalProps) => {
  if (!version && !isLoading) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-8 pt-8 pb-4 border-b border-border/60">
          <DialogTitle className="flex flex-wrap items-center gap-3 text-2xl font-semibold">
            <Building2 className="h-6 w-6 text-primary shrink-0" />
            {isLoading ? (
              "Chargement..."
            ) : (
              <>
                <span className="truncate">{version?.name}</span>
                <Badge
                  variant="outline"
                  className="text-xs font-normal px-3 py-1"
                >
                  Version du {version ? formatDate(version.createdAt) : ""}
                </Badge>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-3/4 rounded-xl" />
            </div>
          ) : version ? (
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Identité
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20 rounded-xl p-5">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      NIF
                    </span>
                    <p className="font-mono text-base font-medium">
                      {version.nif}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      STAT
                    </span>
                    <p className="font-mono text-base font-medium">
                      {version.stat}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      RIF
                    </span>
                    <p className="font-mono text-base font-medium">
                      {version.rif || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresses
                </h4>
                <div className="space-y-3 bg-muted/20 rounded-xl p-5">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Principale
                    </span>
                    <p className="text-base">{version.mainAddress}</p>
                    {version.mainAddressDetail && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {version.mainAddressDetail}
                      </p>
                    )}
                  </div>
                  {version.secondaryAddress && (
                    <div className="pt-2 border-t border-border/30">
                      <span className="text-xs text-muted-foreground block">
                        Secondaire
                      </span>
                      <p className="text-base">{version.secondaryAddress}</p>
                      {version.secondaryAddressDetail && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {version.secondaryAddressDetail}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 rounded-xl p-5">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Téléphone
                    </span>
                    <p className="text-base">{version.standardPhone || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Email
                    </span>
                    <p className="text-base">{version.contactEmail || "-"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {version.mobileMoneyNumbers &&
                version.mobileMoneyNumbers.length > 0 && (
                  <>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Mobile Money
                      </h4>
                      <div className="bg-muted/20 rounded-xl p-5 space-y-2">
                        {version.mobileMoneyNumbers.map((m, idx) => (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center gap-2 text-base"
                          >
                            <span className="font-mono font-medium">
                              {m.numero}
                            </span>
                            <span className="text-muted-foreground">—</span>
                            <span>{m.nom || "sans nom"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

              {(version.bankAccountHolder ||
                version.bankBranch ||
                version.bankCode ||
                version.ribInfo) && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Informations bancaires
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 rounded-xl p-5">
                    {version.bankAccountHolder && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Titulaire
                        </span>
                        <p className="text-base">{version.bankAccountHolder}</p>
                      </div>
                    )}
                    {version.bankBranch && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Domiciliation
                        </span>
                        <p className="text-base">{version.bankBranch}</p>
                      </div>
                    )}
                    {version.bankCode && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Code banque
                        </span>
                        <p className="text-base">{version.bankCode}</p>
                      </div>
                    )}
                    {version.ribInfo && (
                      <div className="md:col-span-2">
                        <span className="text-xs text-muted-foreground block">
                          RIB
                        </span>
                        <p className="font-mono text-base">{version.ribInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Conditions
                </h4>
                <div className="space-y-3 bg-muted/20 rounded-xl p-5">
                  {version.termsAndConditions && (
                    <p className="text-base">{version.termsAndConditions}</p>
                  )}
                  {version.deliveryLeadTime && (
                    <p className="text-base">
                      <span className="text-muted-foreground">
                        Délai de livraison :
                      </span>{" "}
                      <span className="font-medium">
                        {version.deliveryLeadTime}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              Aucune donnée disponible
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

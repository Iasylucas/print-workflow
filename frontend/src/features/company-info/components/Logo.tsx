import { useCompanyStore } from "@/features/company-info/stores/companyStore";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import logoFallback from "@/assets/images/logo.png";
import { useState } from "react";

interface LogoProps {
  variant?: "default" | "icon";
  className?: string;
  style?: React.CSSProperties;
}

export const Logo = ({ variant = "default", className, style }: LogoProps) => {
  const logoUrl = useCompanyStore((state) => state.company?.logo);
  const companyName = useCompanyStore(
    (state) => state.company?.name || "EWA Print",
  );
  const isLoading = useCompanyStore((state) => state.isLoading);
  const [imgError, setImgError] = useState(false);

  if (isLoading) {
    return variant === "icon" ? (
      <Skeleton className={cn("rounded-lg", className || "h-10 w-10")} />
    ) : (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  const renderIcon = (sizeClass: string) => {
    // ✅ Si logoUrl existe mais a échoué au chargement, ou si logoUrl est null → fallback
    const src = logoUrl && !imgError ? logoUrl : logoFallback;

    return (
      <img
        src={src}
        alt={`${companyName}`}
        className={cn(sizeClass, "object-contain", className)}
        style={style}
        onError={() => setImgError(true)} // ← En cas d'erreur de chargement
      />
    );
  };

  if (variant === "icon") {
    return renderIcon(className || "h-10 w-22");
  }

  return (
    <div
      className={cn("flex items-center gap-2 font-semibold min-w-0", className)}
      style={style}
    >
      {renderIcon("h-8 w-8")}
      {/* <span className="truncate text-sidebar-foreground">{companyName}</span> */}
    </div>
  );
};

// frontend/src/features/company-info/components/Logo.tsx
import { useCompanyStore } from "@/features/company-info/stores/companyStore";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

  const fallbackChar = companyName.charAt(0).toUpperCase();

  const renderIcon = (sizeClass: string) => {
    if (logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={`Logo ${companyName}`}
          className={cn(sizeClass, "object-contain", className)}
          style={style}
        />
      );
    }
    return (
      <div
        className={cn(
          "shrink-0 flex items-center justify-center rounded-lg bg-primary",
          sizeClass,
          className,
        )}
        style={style}
      >
        <span className="text-sm font-bold text-primary-foreground">
          {fallbackChar}
        </span>
      </div>
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
      <span className="truncate text-sidebar-foreground">{companyName}</span>
    </div>
  );
};

import { useCompanyStore } from "@/features/company-info/stores/companyStore";
import { Skeleton } from "@/components/ui/skeleton";

interface LogoProps {
  variant?: "default" | "icon";
}

export const Logo = ({ variant = "default" }: LogoProps) => {
  const logoUrl = useCompanyStore((state) => state.company?.logo);
  const companyName = useCompanyStore(
    (state) => state.company?.name || "EWA Print",
  );
  const isLoading = useCompanyStore((state) => state.isLoading);

  if (isLoading) {
    return variant === "icon" ? (
      <Skeleton className="h-10 w-10 rounded-lg" />
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
          className={`${sizeClass} object-contain`}
        />
      );
    }
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">
          {fallbackChar}
        </span>
      </div>
    );
  };

  if (variant === "icon") {
    return renderIcon("h-10");
  }

  return (
    <div className="flex items-center gap-2 font-semibold min-w-0">
      {renderIcon("h-8 w-8")}
      <span className="truncate text-sidebar-foreground">{companyName}</span>
    </div>
  );
};

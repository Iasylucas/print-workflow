// src/components/Logo.tsx
import { useCompanyStore } from "@/stores/companyStore";

interface LogoProps {
  variant?: "default" | "icon";
}

export const Logo = ({ variant = "default" }: LogoProps) => {
  const { company, isLoading } = useCompanyStore();
  const companyName = company?.name || "EWA Print"; // Si company.name n'existe pas, adapter
  const logoUrl = company?.logo;

  if (variant === "icon") {
    if (logoUrl) {
      return <img src={logoUrl} alt="Logo" className="h-10 object-contain " />;
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">
          {companyName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 font-semibold">
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">
            {companyName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span>{companyName}</span>
    </div>
  );
};

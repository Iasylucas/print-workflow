// import type { LucideIcon } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// interface KpiCardProps {
//   label: string;
//   value: string | number;
//   icon: LucideIcon;
//   description?: string;
//   variant?: "default" | "success" | "warning" | "destructive";
//   isLoading?: boolean;
//   className?: string;
// }

// const variantStyles: Record<
//   NonNullable<KpiCardProps["variant"]>,
//   { icon: string; value: string }
// > = {
//   default: {
//     icon: "bg-primary/10 text-primary",
//     value: "text-foreground",
//   },
//   success: {
//     icon: "bg-emerald-500/15 text-emerald-600",
//     value: "text-emerald-600",
//   },
//   warning: {
//     icon: "bg-amber-500/15 text-amber-600",
//     value: "text-amber-600",
//   },
//   destructive: {
//     icon: "bg-destructive/15 text-destructive",
//     value: "text-destructive",
//   },
// };

// export const KpiCard = ({
//   label,
//   value,
//   icon: Icon,
//   description,
//   variant = "default",
//   isLoading = false,
//   className,
// }: KpiCardProps) => {
//   const styles = variantStyles[variant];

//   return (
//     <Card className={cn("card-gradient border-border shadow-xs", className)}>
//       <CardContent className="p-4">
//         <div className="flex items-start justify-between gap-3">
//           <div className="min-w-0 flex-1">
//             <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
//               {label}
//             </p>
//             {isLoading ? (
//               <div className="h-7 w-24 bg-muted/50 rounded animate-pulse mt-2" />
//             ) : (
//               <p
//                 className={cn("text-xl font-bold mt-1 truncate", styles.value)}
//               >
//                 {value}
//               </p>
//             )}
//             {description && (
//               <p className="text-[10px] mt-1 truncate">{description}</p>
//             )}
//           </div>
//           <div
//             className={cn(
//               "h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center",
//               styles.icon,
//             )}
//           >
//             <Icon className="h-4 w-4" strokeWidth={2.5} />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "success" | "warning" | "destructive";
  isLoading?: boolean;
  className?: string;
}

const dotStyles: Record<NonNullable<KpiCardProps["variant"]>, string> = {
  default: "hidden",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export const KpiCard = ({
  label,
  value,
  icon: Icon,
  description,
  variant = "default",
  isLoading = false,
  className,
}: KpiCardProps) => {
  return (
    <Card
      className={cn(
        "gap-0 py-0 shadow-none transition-colors",
        "[a:hover_&]:border-foreground/25",
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                dotStyles[variant],
              )}
            />
            <p className="truncate text-sm text-muted-foreground">{label}</p>
          </div>
          <Icon className="size-4 shrink-0 text-muted-foreground/60" />
        </div>

        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-24" />
        ) : (
          <p className="mt-3 truncate text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        )}

        {description && (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

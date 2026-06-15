import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableStatusBarProps {
  totalCount: number;
  limit: number;
  isLoading: boolean;
  onLimitChange: (newLimit: number) => void;
  entityName?: string;
}

export const TableStatusBar = ({
  totalCount,
  limit,
  isLoading,
  onLimitChange,
  entityName = "élément",
}: TableStatusBarProps) => {
  return (
    <div className="flex flex-row justify-between items-center gap-2 text-xs text-muted-foreground px-1 py-1">
      {}
      <div className="font-medium font-sans">
        {isLoading ? (
          <span className="opacity-50">Calcul des données...</span>
        ) : (
          <>
            Total :{" "}
            <span className="text-foreground font-semibold">{totalCount}</span>{" "}
            {entityName}
            {totalCount > 1 ? "s" : ""}
          </>
        )}
      </div>

      {}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <span className="font-sans">Lignes par page :</span>
        <Select
          value={String(limit)}
          onValueChange={(val) => onLimitChange(Number(val))}
        >
          <SelectTrigger className="h-7 w-[70px] bg-background/50 border-input rounded-md text-xs focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-md font-sans">
            <SelectItem value="10" className="text-xs">
              10
            </SelectItem>
            <SelectItem value="20" className="text-xs">
              20
            </SelectItem>
            <SelectItem value="50" className="text-xs">
              50
            </SelectItem>
            <SelectItem value="100" className="text-xs">
              100
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

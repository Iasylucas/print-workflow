import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface FailedTable {
  refetch: () => void;
  sujet: string;
}

export const FailedTable = ({ refetch, sujet }: FailedTable) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <p className="text-destructive">Erreur lors du chargement des {sujet}.</p>
      <Button variant="outline" onClick={refetch}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
};

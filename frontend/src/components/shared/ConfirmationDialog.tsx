import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

interface ConfirmationDialogProps {
  state: ConfirmationState;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmationDialog = ({
  state,
  onOpenChange,
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog open={state.isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-lg shadow-md font-sans max-w-md animate-in fade-in zoom-in-95 duration-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold tracking-tight">
            {state.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground/90 leading-relaxed mt-1">
            {state.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="rounded-lg h-9 text-xs font-medium">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={state.onConfirm}
            variant={state.isDestructive ? "destructive" : "default"}
            className="rounded-lg h-9 text-xs font-medium shadow-xs"
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

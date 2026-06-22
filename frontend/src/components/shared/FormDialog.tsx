import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description: string;
  submitLabel?: string;
  pendingLabel?: string;
  isPending?: boolean;
  maxWidthClassName?: string;
  children: React.ReactNode;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  submitLabel = "Enregistrer",
  pendingLabel = "Enregistrement...",
  isPending = false,
  maxWidthClassName = "sm:max-w-md",
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isPending && (open ? undefined : onClose())}
    >
      <DialogContent
        className={cn("rounded-lg shadow-md font-sans", maxWidthClassName)}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-2">
          {children}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {pendingLabel}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

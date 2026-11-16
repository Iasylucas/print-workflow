import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssistantPanel } from "./AssistantPanel";

export const AssistantButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Assistant"
        className="h-9 w-9 text-muted-foreground hover:text-foreground"
      >
        <Sparkles className="h-5 w-5" />
      </Button>
      <AssistantPanel open={open} onOpenChange={setOpen} />
    </>
  );
};

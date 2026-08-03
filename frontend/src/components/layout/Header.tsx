import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/features/company-info/components/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="lg:hidden z-50 flex h-14 w-full shrink-0 items-center justify-between px-6 border-b bg-sidebar text-sidebar-foreground transition-all">
      <Logo variant="icon" />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="h-9 w-9 text-muted-foreground hover:text-sidebar-foreground hover:bg-muted/50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

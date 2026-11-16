import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeftIcon } from "lucide-react";
import { ThemeToggle } from "../shared/ThemeToggle";
import { Logo } from "@/features/company-info/components/Logo";
import { NotificationBell } from "@/features/notifications";

export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur px-4 transition-all">
      {/* Gauche : trigger desktop + logo mobile */}
      <div className="flex items-center gap-2">
        {/* Trigger desktop : visible seulement en desktop */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="hidden lg:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <PanelLeftIcon className="h-5 w-5" />
        </Button>

        {/* Logo : visible seulement en mobile */}
        <div className="lg:hidden">
          <Logo variant="icon" />
        </div>
      </div>

      {/* Droite : notifs + thème mobile + burger mobile */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <NotificationBell />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

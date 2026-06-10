import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button"; // 💡 Import sécurisé via ton alias @/
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // 💡 Correction du chemin absolu brisé
import { useTheme } from "@/contexts/ThemeContext"; // 💡 Lié à ton vrai fichier de contexte

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Ajout d'une classe de transition de couleur pour correspondre au style pro du Header */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="text-muted-foreground hover:text-sidebar-foreground hover:bg-muted/50 transition-colors"
        >
          <SunIcon className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 z-60">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <SunIcon className="h-4 w-4" />
          <span>Clair</span>
          {theme === "light" && <CheckIcon className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <MoonIcon className="h-4 w-4" />
          <span>Sombre</span>
          {theme === "dark" && <CheckIcon className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <MonitorIcon className="h-4 w-4" />
          <span>Système</span>
          {theme === "system" && <CheckIcon className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

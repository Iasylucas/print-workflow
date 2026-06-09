// src/components/layout/AppSidebar.tsx
import { useMenuItems } from "@/hooks/useMenuItems";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, ChevronUp, Circle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo"; // ⚠️ Ce composant devra être dynamique

/**
 * Barre latérale principale de l'application.
 * Composée de :
 * - Un en-tête (SidebarHeader) pour le logo/le nom de l'entreprise
 * - Une zone de contenu (SidebarContent) avec le menu de navigation
 * - Un pied de page (SidebarFooter) avec les informations de l'utilisateur et la déconnexion
 *
 * Le contenu du menu est généré dynamiquement en fonction du rôle de l'utilisateur
 * via le hook useMenuItems. Le pied de page affiche l'utilisateur connecté avec
 * un menu déroulant pour gérer son compte et se déconnecter.
 */
export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const menuItems = useMenuItems();

  // Génération des initiales pour l'avatar par défaut
  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "U";

  // Nom complet de l'utilisateur
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Utilisateur";

  return (
    <Sidebar>
      {/* En-tête de la sidebar : Logo et/ou nom de l'entreprise */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-0.5 max-lg:p-2">
            {/* 
              ⚠️ À remplacer par un composant qui utilise les informations
              de l'entreprise stockées en base de données (CompanyInfo). 
              Pour le MVP, on peut garder un texte simple.
            */}

            <Logo variant="icon" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Zone de contenu : Menu de navigation dynamique */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  {/* <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton> */}
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Pied de page : Informations utilisateur et déconnexion */}
      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
              {/* Avatar de l'utilisateur (initiales en fallback) */}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Informations utilisateur + indicateur de statut */}
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-sm font-medium">{fullName}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                  <span>En ligne</span>
                </div>
              </div>
              {/* Indicateur d'ouverture du menu */}
              <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          {/* Menu déroulant des actions du compte utilisateur */}
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

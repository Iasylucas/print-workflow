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
  SidebarMenuSkeleton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useCompanyStore } from "@/features/company-info/stores/companyStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Logo } from "@/features/company-info/components/Logo";

export const AppSidebar = () => {
  const { user, logout, fullName, avatarInitials } = useAuth();
  const menuItems = useMenuItems();

  const isCompanyLoading = useCompanyStore((state) => state.isLoading);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const isLoading = isCompanyLoading || isAuthLoading;

  if (isLoading) {
    return (
      <Sidebar variant="sidebar">
        <SidebarHeader className="p-4">
          <Skeleton className="h-9 w-32 rounded-lg" />
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, index) => (
              <SidebarMenuItem key={index} className="px-2 py-1">
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4 flex flex-row items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-0.5 max-lg:p-2 flex items-center justify-between">
            <Logo variant="icon" />
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <NavLink to={item.href}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={isActive}
                      >
                        <div>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/profile">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      tooltip="Mon profil"
                      isActive={isActive}
                    >
                      <div>
                        <User className="h-4 w-4" />
                        <span>Mon profil</span>
                      </div>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              {user?.role === "ADMIN" && (
                <SidebarMenuItem>
                  <NavLink to="/settings">
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        tooltip="Paramètres"
                        isActive={isActive}
                      >
                        <div>
                          <Settings className="h-4 w-4" />
                          <span>Paramètres</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <div className="flex w-full items-center gap-3 px-1 py-1.5">
          <div className="relative">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.avatarUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-xs font-semibold rounded-[inherit]">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>

            <div
              className="absolute bottom-0 right-0 size-2
                      rounded-full bg-emerald-500 dark:bg-emerald-400
                      ring-sidebar ring-1"
            ></div>
          </div>

          <div className="flex flex-1 flex-col items-start text-left min-w-0">
            <span className="truncate text-sm font-medium leading-none text-sidebar-foreground">
              {fullName}
            </span>
            <span className="truncate text-xs text-muted-foreground mt-1">
              {user?.email || "email@exemple.com"}
            </span>
          </div>

          <button
            onClick={() => logout()}
            className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

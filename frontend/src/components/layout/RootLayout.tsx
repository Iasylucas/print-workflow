import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "./Header";

export const RootLayout = () => {
  return (
    <TooltipProvider>
      {/* On place le provider au sommet pour nourrir le Header et la Sidebar */}
      <SidebarProvider className="flex flex-col min-h-screen w-full bg-background">
        {/* Le Header global, fixe et calé tout en haut */}

        {}
        <Header />

        {/* Le conteneur horizontal pour la Sidebar et le contenu des pages */}
        <div className="flex flex-1 w-full min-h-0 relative">
          <AppSidebar />

          <SidebarInset className="p-6 transition-all duration-300">
            <main className="flex-1">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

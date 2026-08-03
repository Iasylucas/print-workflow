import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "./Header";
import { useSessionGuard } from "@/features/auth/hooks/useSessionGuard";

export const RootLayout = () => {
  useSessionGuard();
  return (
    <TooltipProvider>
      <SidebarProvider className="flex flex-col min-h-screen w-full bg-background">
        <Header />
        <div className="flex flex-1 w-full min-h-0 relative">
          <AppSidebar />

          <SidebarInset className="p-4 sm:p-6 lg:p-10 lg:pt-12 transition-all duration-300 bg-background">
            <main className="flex-1 w-full max-w-[1700px] mx-auto">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

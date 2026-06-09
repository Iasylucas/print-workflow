import { useAuth } from "@/features/auth/hooks/useAuth";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  FileText,
  FileCheck,
  Receipt,
  Settings,
} from "lucide-react";

export type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const MENU_CONFIG: Record<string, MenuItem[]> = {
  ADMIN: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users", label: "Utilisateurs", icon: Users },
    { href: "/clients", label: "Clients", icon: Building2 },
    { href: "/products", label: "Produits", icon: Package },
    { href: "/orders", label: "Commandes", icon: FileText },
    { href: "/quotes", label: "Devis", icon: FileCheck },
    { href: "/invoices", label: "Factures", icon: Receipt },
    { href: "/settings", label: "Paramètres", icon: Settings },
  ],
  SALES: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Building2 },
    { href: "/products", label: "Produits", icon: Package },
    { href: "/orders", label: "Commandes", icon: FileText },
    { href: "/quotes", label: "Devis", icon: FileCheck },
    { href: "/invoices", label: "Factures", icon: Receipt },
  ],
  PRINTER: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Commandes", icon: FileText },
  ],
  GRAPHIC_DESIGNER: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Commandes", icon: FileText },
  ],
};

export const useMenuItems = (): MenuItem[] => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user?.role) {
    return [];
  }
  return MENU_CONFIG[user.role] || [];
};

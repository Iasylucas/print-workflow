import { useAuth } from "@/features/auth/hooks/useAuth";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  Building2,
  Package,
  FileText,
  FileCheck,
  Receipt,
  History,
  LayoutDashboard,
} from "lucide-react";

export type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const MENU_CONFIG: Record<string, MenuItem[]> = {
  ADMIN: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Building2 },
    { href: "/pos", label: "Prise de commande", icon: Receipt },
    { href: "/quotes", label: "Devis", icon: FileCheck },
    { href: "/orders", label: "Commandes", icon: FileText },
    { href: "/invoices", label: "Factures", icon: Receipt },
    {
      href: "/payment-audit-logs",
      label: "Historique paiements",
      icon: History,
    },
    { href: "/products", label: "Produits", icon: Package },
    { href: "/users", label: "Utilisateurs", icon: Users },
  ],
  SALES: [
    { href: "/clients", label: "Clients", icon: Building2 },
    { href: "/pos", label: "Prise de commande", icon: Receipt },
    { href: "/quotes", label: "Devis", icon: FileCheck },
    { href: "/orders", label: "Commandes", icon: FileText },
    { href: "/invoices", label: "Factures", icon: Receipt },
  ],
  PRINTER: [
    { href: "/orders", label: "Commandes", icon: FileText },
    { href: "/invoices", label: "Factures", icon: Receipt },
  ],
  GRAPHIC_DESIGNER: [
    { href: "/orders", label: "Commandes", icon: FileText },
    { href: "/invoices", label: "Factures", icon: Receipt },
  ],
};

export const useMenuItems = (): MenuItem[] => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user?.role) {
    return [];
  }
  return MENU_CONFIG[user.role] || [];
};

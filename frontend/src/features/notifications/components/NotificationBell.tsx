import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUnreadCount } from "../hooks/useUnreadCount";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { notificationsApi } from "../services/notificationsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: unreadData } = useUnreadCount();
  const { data, isLoading } = useNotifications({ page: 1, limit: 5 });

  const unreadCount = unreadData?.count ?? 0;
  const notifications = data?.data ?? [];

  const handleMarkAllAsRead = async () => {
    await notificationsApi.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    if (nextOpen && unreadCount > 0) {
      notificationsApi.markAllAsRead().then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    }
  };
  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-[10px] font-medium text-white flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <Check className="h-3 w-3" />
              Tout lire
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="p-2 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          <div className="max-h-[320px] overflow-y-auto divide-y divide-border/50">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                compact
                onNavigate={() => setIsOpen(false)}
              />
            ))}
          </div>
        )}

        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className="justify-center text-sm text-primary cursor-pointer py-2"
          onClick={() => navigate("/notifications")}
        >
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

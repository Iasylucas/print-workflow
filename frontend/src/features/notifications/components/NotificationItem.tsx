import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notificationsApi } from "../services/notificationsApi";
import type { Notification } from "../types/notifications.types";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  compact?: boolean;
  onNavigate?: () => void;
}

const formatRelative = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffD = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH} h`;
  if (diffD < 7) return `Il y a ${diffD} j`;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const NotificationItem = ({
  notification,
  compact = false,
  onNavigate,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isUnread = notification.readAt === null;

  const handleClick = async () => {
    if (isUnread) {
      await notificationsApi.markAsRead(notification.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    onNavigate?.();
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50",
        isUnread && "bg-primary/5",
        compact && "py-2",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5",
          isUnread
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Bell className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm truncate",
              isUnread ? "font-semibold" : "font-medium",
            )}
          >
            {notification.title}
          </span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
            {formatRelative(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {notification.message}
        </p>
      </div>

      {isUnread && (
        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </button>
  );
};

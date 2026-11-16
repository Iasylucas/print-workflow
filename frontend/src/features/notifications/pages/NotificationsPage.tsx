import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { NotificationsList } from "../components/NotificationsList";
import { notificationsApi } from "../services/notificationsApi";
import { useUnreadCount } from "../hooks/useUnreadCount";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread";

export const NotificationsPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const queryClient = useQueryClient();
  const { data: unreadData } = useUnreadCount();

  const unreadCount = unreadData?.count ?? 0;

  const handleMarkAllAsRead = async () => {
    await notificationsApi.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader title="Notifications" subtitle="Toutes vos notifications">
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Tout marquer comme lu
          </Button>
        )}
      </PageHeader>

      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Toutes
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
          className="gap-1"
        >
          Non lues
          {unreadCount > 0 && (
            <span
              className={cn(
                "text-[10px] px-1.5 py-0 rounded-full",
                filter === "unread"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-destructive text-white",
              )}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      <NotificationsList unreadOnly={filter === "unread"} key={filter} />
    </div>
  );
};
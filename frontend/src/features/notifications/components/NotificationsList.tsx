import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

interface NotificationsListProps {
  unreadOnly?: boolean;
}

export const NotificationsList = ({
  unreadOnly = false,
}: NotificationsListProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useNotifications({
    page,
    limit: PAGE_SIZE,
    unreadOnly,
  });

  const notifications = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Bell className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          Aucune notification pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="divide-y divide-border/50 rounded-lg border bg-card overflow-hidden">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notification={notif} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {meta.page} sur {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
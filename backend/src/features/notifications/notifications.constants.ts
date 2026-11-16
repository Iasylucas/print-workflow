export const NOTIFICATIONS_ERRORS = {
  NOT_FOUND: "Notification introuvable",
  FETCH_FAILED: "Échec de la récupération des notifications",
  MARK_READ_FAILED: "Échec du marquage de la notification comme lue",
  MARK_ALL_READ_FAILED:
    "Échec du marquage de toutes les notifications comme lues",
  DELETE_FAILED: "Échec de la suppression de la notification",
} as const;

export const NOTIFICATION_TYPES = {
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_UPDATED: "ORDER_UPDATED",
  ORDER_FILE_COMPLETED: "ORDER_FILE_COMPLETED",
  ORDER_READY_FOR_DELIVERY: "ORDER_READY_FOR_DELIVERY",
  ORDER_DELIVERED: "ORDER_DELIVERED",
  ORDER_STATUS_ROLLBACK: "ORDER_STATUS_ROLLBACK",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

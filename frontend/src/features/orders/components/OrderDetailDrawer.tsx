// frontend/src/features/orders/components/OrderDetailDrawer.tsx
import { useOrderDetail, useOrderMutations } from "../hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  Link2,
  Plus,
  X,
  Trash2,
  User,
  Calendar,
  Package,
  Ruler,
  Tag,
} from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "../schema/orders.schema";
import type { OrderStatus } from "../types/orders.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderDetail } from "../types/orders.types";

interface OrderDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number | null;
}

export const OrderDetailDrawer = ({
  isOpen,
  onOpenChange,
  orderId,
}: OrderDetailDrawerProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null,
  );
  const { data: order, isLoading, refetch } = useOrderDetail(orderId);
  const {
    addNoteMutation,
    addFileMutation,
    deleteNoteMutation,
    deleteFileMutation,
    updateStatusMutation,
  } = useOrderMutations();

  const [newNote, setNewNote] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileCategory, setNewFileCategory] = useState<
    "client_visual" | "final_print"
  >("client_visual");
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!orderId) return null;

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) return;
    if (selectedStatus === order.status) {
      toast.info("Le statut est déjà à jour");
      return;
    }
    await updateStatusMutation.mutateAsync({
      id: orderId,
      data: { status: selectedStatus },
    });
    setSelectedStatus(null);
    refetch();
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("La note ne peut pas être vide");
      return;
    }
    await addNoteMutation.mutateAsync({
      id: orderId,
      data: { text: newNote },
    });
    setNewNote("");
    setIsNoteDialogOpen(false);
    refetch();
  };

  const handleAddFile = async () => {
    if (!newFileUrl.trim()) {
      toast.error("L'URL du fichier est requise");
      return;
    }
    await addFileMutation.mutateAsync({
      id: orderId,
      data: {
        url: newFileUrl,
        category: newFileCategory,
      },
    });
    setNewFileUrl("");
    setIsFileDialogOpen(false);
    refetch();
  };

  const handleDeleteNote = async (noteId: number) => {
    if (window.confirm("Supprimer cette note ?")) {
      await deleteNoteMutation.mutateAsync(noteId);
      refetch();
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (window.confirm("Supprimer ce fichier ?")) {
      await deleteFileMutation.mutateAsync(fileId);
      refetch();
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      direction="right"
      handleOnly={true}
    >
      <DrawerContent className="w-[500px] max-w-full h-full rounded-none">
        <DrawerHeader className="border-b px-4 py-3">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            {/* Colonne gauche : Titre + Statut en colonne */}
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-semibold truncate">
                Détail de la commande
              </span>
            </div>

            {/* Colonne droite : Bouton X */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 shrink-0 justify-self-end"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-80px)] p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-muted-foreground">Référence</p>
                  <div className="inline-block px-1 py-1 rounded-md bg-muted/50 border border-border/50">
                    <span className="font-mono text-foreground">
                      {order.reference}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Désignation
                  </p>
                  <p className="font-semibold">{order.designation}</p>
                </div>
                {order.label && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Label
                    </p>
                    <p>{order.label}</p>
                  </div>
                )}
                {order.dimensions && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Dimensions
                    </p>
                    <p>{order.dimensions}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Client
                  </p>
                  <p>
                    {order.client.firstName} {order.client.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Produit
                  </p>
                  <p>{order.product?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Quantité
                  </p>
                  <p>{order.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Prix unitaire
                  </p>
                  <p>{order.unitPrice.toLocaleString()} Ar</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Créé par
                  </p>
                  <p>
                    {order.createdBy.firstName} {order.createdBy.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Créé le
                  </p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <Separator />
              <div className="flex items-center gap-3 mt-3">
                <Select
                  value={selectedStatus || ""}
                  onValueChange={(val) => {
                    const newStatus = val as OrderStatus;
                    if (newStatus === order.status) return;
                    updateStatusMutation.mutate({
                      id: orderId,
                      data: { status: newStatus },
                    });
                    setSelectedStatus(newStatus);
                    refetch();
                  }}
                >
                  <SelectTrigger className="h-9 w-[220px]">
                    <SelectValue placeholder="Changer le statut..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {updateStatusMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>
              <Separator />
              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    Notes ({order.notes.length})
                  </h3>
                  <Dialog
                    open={isNoteDialogOpen}
                    onOpenChange={setIsNoteDialogOpen}
                    modal={false}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter une note</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Saisissez votre note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={4}
                        />
                        <Button
                          onClick={handleAddNote}
                          disabled={addNoteMutation.isPending}
                        >
                          {addNoteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Ajouter"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {order.notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune note</p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {order.notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-muted/20 p-3 rounded-lg relative group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm">{note.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {note.user.firstName} {note.user.lastName} -{" "}
                              {new Date(note.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Fichiers */}
              {/* <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    Fichiers ({order.files.length})
                  </h3>
                  <Dialog
                    open={isFileDialogOpen}
                    onOpenChange={setIsFileDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter un fichier</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="URL du fichier (Mega.nz, etc.)"
                          value={newFileUrl}
                          onChange={(e) => setNewFileUrl(e.target.value)}
                        />
                        <select
                          value={newFileCategory}
                          onChange={(e) =>
                            setNewFileCategory(
                              e.target.value as "client_visual" | "final_print",
                            )
                          }
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="client_visual">Visuel client</option>
                          <option value="final_print">Visuel à imprimer</option>
                        </select>
                        <Button
                          onClick={handleAddFile}
                          disabled={addFileMutation.isPending}
                        >
                          {addFileMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Ajouter"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {order.files.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun fichier</p>
                ) : (
                  <div className="space-y-2">
                    {order.files.map((file) => (
                      <div
                        key={file.id}
                        className="bg-muted/20 p-3 rounded-lg flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="h-4 w-4 shrink-0" />
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline truncate"
                          >
                            {file.url}
                          </a>
                          <Badge variant="outline" className="text-xs">
                            {file.category === "client_visual"
                              ? "Client"
                              : "À imprimer"}
                          </Badge>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Fichiers - Séparés par catégorie */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    Fichiers ({order.files.length})
                  </h3>
                  <Dialog
                    open={isFileDialogOpen}
                    onOpenChange={setIsFileDialogOpen}
                    modal={false}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter un fichier</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="URL du fichier (Mega.nz, etc.)"
                          value={newFileUrl}
                          onChange={(e) => setNewFileUrl(e.target.value)}
                        />
                        <select
                          value={newFileCategory}
                          onChange={(e) =>
                            setNewFileCategory(
                              e.target.value as "client_visual" | "final_print",
                            )
                          }
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="client_visual">Visuel client</option>
                          <option value="final_print">Visuel à imprimer</option>
                        </select>
                        <Button
                          onClick={handleAddFile}
                          disabled={addFileMutation.isPending}
                        >
                          {addFileMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Ajouter"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Section Visuel client */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Visuel client
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {
                        order.files.filter(
                          (f) => f.category === "client_visual",
                        ).length
                      }
                    </Badge>
                  </div>
                  {order.files.filter((f) => f.category === "client_visual")
                    .length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Aucun visuel client
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {order.files
                        .filter((f) => f.category === "client_visual")
                        .map((file) => (
                          <div
                            key={file.id}
                            className="bg-muted/20 p-2 rounded-lg flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                              <FileText className="h-3.5 w-3.5 shrink-0" />
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:underline truncate block max-w-[200px]"
                              >
                                {file.url}
                              </a>
                            </div>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Section Visuel à imprimer */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Visuel à imprimer
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {
                        order.files.filter((f) => f.category === "final_print")
                          .length
                      }
                    </Badge>
                  </div>
                  {order.files.filter((f) => f.category === "final_print")
                    .length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Aucun visuel à imprimer
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {order.files
                        .filter((f) => f.category === "final_print")
                        .map((file) => (
                          <div
                            key={file.id}
                            className="bg-muted/20 p-2 rounded-lg flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                              <FileText className="h-3.5 w-3.5 shrink-0" />
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:underline truncate block max-w-[300px]"
                              >
                                {file.url}
                              </a>
                            </div>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Commande introuvable
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

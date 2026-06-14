import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UsersQueryParams, User } from "../types/user.types";
import { Switch } from "@/components/ui/switch";

interface UserTableProps {
  data:
    | {
        data: User[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
          hasMore: boolean;
        };
      }
    | undefined;
  isLoading: boolean;

  queryParams: UsersQueryParams;

  goToPage: (page: number) => void;
  handleSort: (sortBy: UsersQueryParams["sortBy"]) => void;

  handleEdit: (user: User) => void;
  handleDelete: (userId: string) => void;
  handleStatusToggle: (user: User) => void;
}

export const UserTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  handleSort,
  handleEdit,
  handleDelete,
  handleStatusToggle,
}: UserTableProps) => {
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  return (
    <div className="border rounded-md">
      <Table className="table-layout-fixed w-full">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead
              className="w-[25%] cursor-pointer"
              onClick={() => handleSort("firstName")}
            >
              Utilisateurs
              {queryParams.sortBy === "firstName" && (
                <span className="ml-1">
                  {queryParams.sortOrder === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer w-[30%]"
              onClick={() => handleSort("email")}
            >
              Email
              {queryParams.sortBy === "email" && (
                <span className="ml-1">
                  {queryParams.sortOrder === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="w-[15%] cursor-pointer inline-flex items-center"
              onClick={() => handleSort("role")}
            >
              Rôle
              {queryParams.sortBy === "role" && (
                <span className="ml-1">
                  {queryParams.sortOrder === "asc" ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </span>
              )}
            </TableHead>
            <TableHead className="w-[15%]">Statut</TableHead>
            <TableHead
              className="w-[15%] cursor-pointer inline-flex items-center"
              onClick={() => handleSort("createdAt")}
            >
              Inscrit le
              {queryParams.sortBy === "createdAt" && (
                <span className="ml-1">
                  {queryParams.sortOrder === "asc" ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </span>
              )}
            </TableHead>
            <TableHead className="w-15">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-muted animate-pulse shrink-0" />
                    <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                </TableCell>

                <TableCell className="py-3">
                  <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
                </TableCell>

                <TableCell className="py-3">
                  <div className="h-4 w-20 rounded-md bg-muted animate-pulse" />
                </TableCell>

                <TableCell className="py-3 text-right">
                  <div className="h-8 w-8 rounded-md bg-muted animate-pulse ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : data?.data?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                Aucun utilisateur trouvé.
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-xs">
                        {`${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => handleStatusToggle(user)}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium font-sans transition-colors",
                      )}
                    >
                      {user.isActive ? "Activé" : "Désactivé"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="bg-muted/40 flex items-center justify-between px-4 py-2 border-t (ou vide pour ton unibody)">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) goToPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) goToPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export type User = {
  avatarUrl: string | undefined;
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "ADMIN" | "SALES" | "PRINTER" | "GRAPHIC_DESIGNER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UsersQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "email" | "firstName" | "lastName" | "role";
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
};

export type PaginatedUsersResponse = {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
  };
};

export type InviteUserRequest = {
  email: string;
  role: User["role"];
};

export type EditUserRequest = {
  avatarUrl?: string | undefined;
  firstName?: string | null;
  lastName?: string | null;
  role?: User["role"];
  isActive?: boolean;
};

export type UpdateProfileRequest = {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | undefined;
};

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export type ApiSuccess<T = void> = {
  success: true;
  message?: string;
  data?: T;
};

export type ApiError = {
  success: false;
  error: string;
  details?: Array<{ field: string; message: string }>;
};

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

export type SimpleApiResponse = {
  success: boolean;
  message: string;
};

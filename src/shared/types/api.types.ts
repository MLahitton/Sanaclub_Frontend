export type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type SortDirection = "asc" | "desc";

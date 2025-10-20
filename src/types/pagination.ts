export interface PaginationQueryDto {
  page: number;
  limit: number;
}

export interface PaginationWithSearchQueryDto extends PaginationQueryDto {
  search: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

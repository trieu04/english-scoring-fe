export interface PaginationQueryDto {
  page: number;
  limit: number;
}

export interface PaginationWithSearchQueryDto extends PaginationQueryDto {
  search: string;
}

export interface PaginatedMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

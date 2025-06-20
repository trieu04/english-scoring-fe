export interface IPaginationState {
  itemsPerPage: number;
  page: number;
  search?: string;
}

export interface IPagination<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

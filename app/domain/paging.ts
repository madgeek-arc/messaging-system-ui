export class NewPaging<T> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  pageable: PageableObject;
  numberOfElements: number;
  empty: boolean;
}

export class SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export class PageableObject {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface MainMenuDto {
  label: string,
  path: string,
}

export interface ErrorMessage {
  statusCode: number;
  message: string;
}

export class ResponsePagination<T> implements ResponseEntity<T> {
  status!: ResponseStatus;
  data!: T;
  paging!: Paging;
}

export interface ResponseEntity<T> {
  status: ResponseStatus;
  data: T;
}

export interface ResponseStatus {
  code: number;
  description: string;
}

export interface Paging {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  totalPages: number;
}

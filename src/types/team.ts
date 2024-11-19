export interface Team {
    id: string,
    name: string,
    eventId: string,
    eventTitle: string,
}

export interface Pagination {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }

export interface TeamResponse {
    data: Team[],
    pagination: Pagination
}
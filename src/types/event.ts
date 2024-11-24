export interface Event {
    id: string,
    title: string,
    description: string,
    image: string,
    registrationStartDate: string,
    registrationEndDate: string,
    eventStartDate: string,
    eventEndDate: string,
    officialId: string,
    officialName: string,
    allowedSportLimit: number,
    status: string,
    isActive: boolean,
    createdDate: string,
    updatedDate: string,
}

export interface Pagination {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface EventResponse {
  data: Event[],
  pagination: Pagination,
}
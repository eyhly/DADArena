export interface SportPlayer {
    id: string,
    userId: string[],
    eventId: string,
    sportId: string,
    teamId: string,
    sportTitle: string,
    teamName: string,
    email: string,
    fullname: string,
    gender: string,
}

export interface Pagination {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }

export interface SportPlayerResponse{
    data: SportPlayer[];
    pagination: Pagination; 
}
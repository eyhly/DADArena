export interface TeamMember {
    userId: string[],
    username: string,
    email: string,
    user_Metadata: {fullname: string, gender: string,},
    fullname: string,
    gender: string,
    name: string,
    teamId: string,
    teamName: string,
    id: string,
}

export interface Pagination {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }

export interface TeamMemberResponse {
    data: TeamMember[],
    pagination: Pagination,
}
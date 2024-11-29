export interface Attendance {
    id: string,
    eventId: string,
    scheduleId: string,
    fullname: string,
    teamId: string,
    userId: string,
    name: string,
    username: string,
    time: string,
    userLatitude?: number,
    userLongitude?: number,
}

export interface Pagination {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }

export interface AttendanceResponse {
    data: Attendance[],
    pagination: Pagination,
}
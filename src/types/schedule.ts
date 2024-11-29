export interface Schedule {
    id: string,
    eventId: string,
    week: number,
    date: string,
    startAttendance: string,
    endAttendance: string,
    longitude: string,
    latitude: string,
}

export interface ScheduleResponse {
    data: Schedule[];
  }
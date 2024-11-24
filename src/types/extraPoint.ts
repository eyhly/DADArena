export interface ExtraPoint {
    id: string,
    week: number,
    teamId: string,
    description: string,
    point: number,
    eventId: string,
}

export interface ExtraPointResponse {
  data: ExtraPoint[];
}

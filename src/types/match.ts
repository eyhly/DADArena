export interface Match {
    id: string,
    week: number,
    eventId: string,
    eventTitle: string,
    sportId: string,
    sportTitle: string,
    teamBlueId: string,
    teamBlueName: string,
    teamRedId: string,
    teamRedName: string,
    teamBlueFinalScore: number,
    teamRedFinalScore: number,
    rounds: {
      matchRound: number;
      teamRedScore: number;
      teamBlueScore: number;
    }[],
    notes: { teamId: string; description: string }[],
    startTime: string,
    endTime: string,
    venue: string,
    status: string,
}

export interface Pagination {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface MatchResponse {
  data: Match[];
  pagination: Pagination
}

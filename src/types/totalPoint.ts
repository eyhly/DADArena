export interface TotalPoint {
    rank: number;
    teamName: string;
    teamId: string;
    totalMatchPoints: number;
    totalExtraPoints: number;
    matchPoints: Array<{ week: string; sportTitle: string; matchPoint: string}>;
    totalPoints: number;
}
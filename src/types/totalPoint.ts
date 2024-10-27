export interface TotalPoint {
    teamId: string;
    totalMatchPoints: number;
    totalExtraPoints: number;
    matchPoints: Array<{ week: string; sportTitle: string; matchPoint: string}>;
    totalPoints: number;
}
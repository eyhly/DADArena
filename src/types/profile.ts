export interface Profile {
    user_Id: string;
    email: string;
    user_Metadata : {fullname: string, gender: string},
    fullname: string;
    gender: string;
    roles: string[];
    teams: {team: string; event: string; teamId: string}[];
}
export interface UserLogin {
    user_Id: string;
    name: string;
    nickname: string;
    username: string;
    user_Metadata: {fullname: string, gender: string;};
    email: string;
    email_verified: boolean;
    roles: Array<{name: string; id: string; }>;
    last_Login: string;
    last_ip: string;
    logins_count: number;
    identities: {user_id: string; provider: string; is_social: boolean; connection: string;} [];
}

export interface Roles {
    roles: {name: string; id: string; }[];
}
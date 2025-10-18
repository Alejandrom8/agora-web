type AgoraApiResponse<T> = {
    data: T;
    status_code: number;
    success: boolean;
    trace_id: string;
};

export type SessionTokens = {
    jwt: string;
    refresh_token?: string;
}

export interface LoginResponse extends AgoraApiResponse<SessionTokens> {};

export interface UserProfileResponse extends AgoraApiResponse<{
    id: string;
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_type: string;
    created_at: string;
    updated_at: string;
}> {};

export interface SignUpResponse extends AgoraApiResponse<{
    message: string;
}> {};

export interface VerifiyEmailResponse extends AgoraApiResponse<SessionTokens> {};
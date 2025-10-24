export type ApiError = {
  code: number;
  message: string;
  scope: string;
};

type AgoraApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
  status_code: number;
  success: boolean;
  trace_id: string;
};

export type SessionTokens = {
  jwt: string;
  refresh_token?: string;
};

export type LoginResponse = AgoraApiResponse<SessionTokens>

export type UserProfileResponse = AgoraApiResponse<{
    id: string;
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_type: string;
    created_at: string;
    updated_at: string;
  }>

export type SignUpResponse = AgoraApiResponse<{
    message: string;
  }>

export type VerifiyEmailResponse = AgoraApiResponse<SessionTokens>

export type EmailExistsResponse = AgoraApiResponse<{
    error?: any;
    data?: boolean;
  }>

export type VerifyOrgInvitationCodeResponse = AgoraApiResponse<object>

export type Organization = {
  id: string;
  name: string;
  description: string;
  identifier: string;
};

export type CreateOrgResponse = AgoraApiResponse<Organization>
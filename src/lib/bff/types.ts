type ApiError = {
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

export interface LoginResponse extends AgoraApiResponse<SessionTokens> {}

export interface UserProfileResponse
  extends AgoraApiResponse<{
    id: string;
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_type: string;
    created_at: string;
    updated_at: string;
  }> {}

export interface SignUpResponse
  extends AgoraApiResponse<{
    message: string;
  }> {}

export interface VerifiyEmailResponse extends AgoraApiResponse<SessionTokens> {}

export interface EmailExistsResponse
  extends AgoraApiResponse<{
    error?: any;
    data?: boolean;
  }> {}

export interface VerifyOrgInvitationCodeResponse extends AgoraApiResponse<{}> {}

export type Organization = {
  id: string;
  name: string;
  description: string;
  identifier: string;
};

export interface CreateOrgResponse extends AgoraApiResponse<Organization> {}
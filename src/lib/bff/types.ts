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

type UserAuth = {
  app_id: string;
  created_at: string;
  email: string;
  id: string;
  udpated_at: string;
  user_id: string;
};

type UserLoginMethod = {
  app_id: string;
  created_at: string;
  entity_id: string;
  entity_type: string;
  id: string;
  is_veryfy: boolean;
  updated_at: string;
  user_id: string;
};

type UserProfile = {
  app_id: string;
  created_at: string;
  id: string;
  is_removed: boolean;
  name: string;
  updated_at: string;
  user_name: string;
};

export type UserProfileResponse = AgoraApiResponse<{
    auth: UserAuth,
    login_method: UserLoginMethod,
    user: UserProfile,
    entity_type: string;
    is_valid: boolean,
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
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

// Events Types
export type EventSponsor = {
  id: string;
  name: string;
  logo_image: string | null;
  website_url: string;
  tier: string;
  order: number;
};

export type EventOrganization = {
  id: string;
  name: string;
  logo_url: string;
  website: string;
};

export type EventSocialLinks = {
  instagram: string;
  linkedin: string;
  x: string;
  facebook: string;
  youtube: string;
  website: string;
};

export type Event = {
  id: string;
  organization_id: string;
  organization: EventOrganization;
  name: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string;
  capacity: number;
  is_public: boolean;
  state: string;
  cover_image: string | null;
  social_links: EventSocialLinks;
  sponsors_count: number;
  sponsors: EventSponsor[];
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type EventsFiltersApplied = {
  organization_id: string | null;
  q: string | null;
  state: string | null;
  is_public: boolean | null;
  full_response: boolean;
  categories_id?: string | null;
};

export type EventsData = {
  events: Event[];
  count: number;
  filters_applied: EventsFiltersApplied;
};

export type EventsResponse = AgoraApiResponse<EventsData>;

// Categories Types
export type Category = {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CategoriesFiltersApplied = {
  parent_id: string | null;
  root_only: boolean;
  q: string | null;
};

export type CategoriesData = {
  categories: Category[];
  count: number;
  filters_applied: CategoriesFiltersApplied;
};

export type CategoriesResponse = AgoraApiResponse<CategoriesData>;
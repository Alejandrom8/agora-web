import { ApiError, Organization } from "../v1/types";

type BffApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
  message: string;
  success: boolean;
};

export type SessionTokens = {
  jwt: string;
  refresh_token?: string;
};

export type LoginResponse = BffApiResponse<SessionTokens>

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

export type UserProfileResponse = BffApiResponse<{
    auth: UserAuth,
    login_method: UserLoginMethod,
    user: UserProfile,
    entity_type: string;
    is_valid: boolean,
  }>

export type SignUpResponse = BffApiResponse<{
    message: string;
  }>

export type VerifiyEmailResponse = BffApiResponse<SessionTokens>

export type EmailExistsResponse = BffApiResponse<{
    error?: any;
    data?: boolean;
  }>

export type VerifyOrgInvitationCodeResponse = BffApiResponse<object>

export type CreateOrgResponse = BffApiResponse<Organization>

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

export type EventsResponse = BffApiResponse<EventsData>;

export type EventResponse = AgoraApiResponse<Event>;

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

export type CategoriesResponse = BffApiResponse<CategoriesData>;
export type CreateOrg = BffApiResponse<Organization>;

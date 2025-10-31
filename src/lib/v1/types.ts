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

export type UserProfile = {
  accounts_user_id: string;
  alias: string;
  created_at: string;
  email: string;
  family_name: string;
  id: string;
  name: string;
  photo_url: string;
  primary_profile: string;
  social_links: string[];
  updated_at: string;
};

export type UserProfileResponse = AgoraApiResponse<{
		user: UserProfile;
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
  website: string;
  logo_url: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type CreateOrgResponse = AgoraApiResponse<Organization>

type ListOrganizationsFilters = {
  name: string;
  created_by: string;
};

export type ListOrganizations = AgoraApiResponse<{
  organizations: Organization[],
  count: number,
  filters_applied: ListOrganizationsFilters
}>

export type GetOrganization = AgoraApiResponse<Organization>;

type OrgSponsor = {
  id: string;
  name: string;
  logo_image: string | null;
  website_url: string;
  tier: string;
  order: number;
};

type OrgSocialLinks = {
  instagram: string;
  linkedin: string;
  x: string;
  facebook: string;
  youtube: string;
  website: string;
};

export type OrgEvent = {
  id: string;
  organization_id: string;
  organization: Organization;
  name: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string;
  capacity: 10;
  is_public: true;
  state: string;
  cover_image: string | null;
  social_links: OrgSocialLinks;
  sponsors_count: number;
  sponsors: OrgSponsor[],
  created_by: string;
  created_at: string;
  updated_at: string;
};

type ListOrgEventsFilters = {
  organization_id: string;
  q: string;
  state: string;
  is_public: string;
  full_response: boolean;
};

export type ListOrgEvents = {
  events: OrgEvent[];
  coutn: number;
  filters_applied: ListOrgEventsFilters;
};

export type GetOrgEvents = AgoraApiResponse<ListOrgEvents>;

export type Event = {
  id: string;
  organization_id: string; 
  name: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string;
  capacity: number;
  is_public: boolean;
  state: string;
  cover_image: string;
  social_links: string[];
  sponsors_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type CreateEventResult = AgoraApiResponse<Event>;

type OrgMember = {
  id: string;
  user_id: string;
  name: string;
  status: string;
  role: string;
  avatarUrl: string;
  organization_id: string;
  invited_by: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
};

type ListOrgMembersFilters = {
  organization_id: string;
  user_id: string | null;
};

export type ListOrgMembers = {
  organization_members: OrgMember[];
  count: number;
  filters_applied: ListOrgMembersFilters;
};

export type ListOrgMembersResult = AgoraApiResponse<ListOrgMembers>;

export type EventStats = {
  event_id: string;
  event_name: string;
  event_state: 'PLANNED' | 'ONGOING' | 'COMPLETED' | string;
  organization_id: string;
  organization_name: string;
  total_sub_events: number;
  total_attendees: number;
  attendees_breakdown: {
    founder: number;
    investor: number;
    attendee: number;
    total: number;
  };
};

export type GetEventStatsResult = AgoraApiResponse<EventStats>;
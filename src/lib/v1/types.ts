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

export type LoginResponse = AgoraApiResponse<SessionTokens>;

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

export type UserRole = 'member' | 'owner' | 'staff' | 'speaker';

export type UserOrg = {
  id: string;
  description: string;
  isActive: boolean;
  joinedAt: string;
  logo_url: string;
  name: string;
  role: UserRole;
};

export type User = {
  organizations: UserOrg[];
  user: UserProfile;
};

export type UserProfileResponse = AgoraApiResponse<User>;

export type SignUpResponse = AgoraApiResponse<{
  message: string;
}>;

export type VerifiyEmailResponse = AgoraApiResponse<SessionTokens>;

export type EmailExistsResponse = AgoraApiResponse<{
  error?: any;
  data?: boolean;
}>;

export type VerifyOrgInvitationCodeResponse = AgoraApiResponse<object>;

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

export type CreateOrgResponse = AgoraApiResponse<Organization>;

type ListOrganizationsFilters = {
  name: string;
  created_by: string;
};

export type ListOrganizations = AgoraApiResponse<{
  organizations: Organization[];
  count: number;
  filters_applied: ListOrganizationsFilters;
}>;

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
  capacity: number;
  is_public: boolean;
  state: string;
  cover_image: string | null;
  social_links: OrgSocialLinks;
  sponsors_count: number;
  sponsors: OrgSponsor[];
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
  count: number;
  filters_applied: ListOrgEventsFilters;
};

export type GetOrgEvents = AgoraApiResponse<ListOrgEvents>;

// Common & shared
export type UUID = string;
export type ISODateTime = string; // e.g. '2025-10-31T12:30:00Z'
export type ISODate = string; // e.g. '2025-10-31'

export type EntityType = 'ORGANIZATION' | 'EVENT' | 'SUB_EVENT';
export type MemberRoleType = 'OWNER' | 'ADMIN' | 'STAFF' | 'SPEAKER';
export type EventState = 'CANCELLED' | 'FINISHED' | 'ONGOING' | 'PLANNED' | string;
export type ProfileType = 'FOUNDER' | 'INVESTOR' | 'ATTENDEE' | string;
export type UserEventState =
  | 'REJECTED'
  | 'MEMBER'
  | 'WAITLIST'
  | 'PENDING'
  | 'INVITED'
  | 'REQUESTED'
  | string;

// Social links (object-based per API)
export type SocialLinks = {
  linkedin?: string | null;
  instagram?: string | null;
  x?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  website?: string | null;
};

// Categories
export type Category = {
  id: UUID;
  name: string;
  description: string | null;
  parent_id: UUID | null;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
};

export type CreateCategoryResult = AgoraApiResponse<Category>;
export type GetCategoriesResult = AgoraApiResponse<{
  categories: Category[];
  count: number;
  filters_applied: { parent_id?: UUID | 'null' | null; root_only?: boolean; q?: string | null };
}>;
export type GetCategoryResult = AgoraApiResponse<Category>;
export type UpdateCategoryResult = AgoraApiResponse<Category>;
export type DeleteCategoryResult = AgoraApiResponse<{ deleted: boolean }>;

// Sponsors
export type SponsorTier = 'gold' | 'silver' | 'bronze' | string;
export type Sponsor = {
  id: UUID;
  event_id: UUID;
  name: string;
  logo_image: string | null;
  website_url: string | null;
  tier: SponsorTier | null;
  order: number;
  created_by?: UUID;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
};

export type CreateSponsorResult = AgoraApiResponse<Sponsor>;
export type GetSponsorsResult = AgoraApiResponse<{
  sponsors: Sponsor[];
  count: number;
  filters_applied: { event_id?: UUID | null; q?: string | null; tier?: SponsorTier | null };
}>;
export type GetSponsorResult = AgoraApiResponse<Sponsor>;
export type UpdateSponsorResult = AgoraApiResponse<Sponsor>;
export type DeleteSponsorResult = AgoraApiResponse<{ deleted: boolean }>;

// Sub-events
export type SubEvent = {
  id: UUID;
  event_id: UUID;
  type: ProfileType; // audience/type
  name: string;
  description: string | null;
  location: string | null;
  start_at: string | null;
  end_at: string | null;
  capacity: number | null;
  allowed_profile_type: Record<string, unknown> | null;
  is_public: boolean;
  state: EventState | null;
  categories: Category[] | string[] | null; // full_response may embed full categories
  tags: string[] | null;
  cover_image: string | null;
  created_by?: UUID;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
};

export type CreateSubEventResult = AgoraApiResponse<SubEvent>;
export type GetSubEventsResult = AgoraApiResponse<{
  sub_events: SubEvent[];
  count: number;
  filters_applied: {
    event_id?: UUID | null;
    type?: ProfileType | null;
    state?: EventState | null;
    category_id?: UUID | null;
    tags?: string | null; // comma separated when sent
    q?: string | null;
    full_response?: boolean;
  };
}>;
export type GetSubEventResult = AgoraApiResponse<SubEvent>;
export type UpdateSubEventResult = AgoraApiResponse<SubEvent>;
export type DeleteSubEventResult = AgoraApiResponse<{ deleted: boolean }>;

// Member roles
export type MemberRole = {
  id: UUID;
  member_id: UUID;
  entity_type: EntityType;
  entity_id: UUID;
  role: MemberRoleType;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
  // Optional extended payloads controlled by `extended=true`
  member?: OrgMember;
  entity?: Organization | Event | SubEvent;
  organization?: Organization;
};

export type CreateMemberRoleResult = AgoraApiResponse<MemberRole>;
export type GetMemberRolesResult = AgoraApiResponse<{
  member_roles: MemberRole[];
  count: number;
  filters_applied: {
    member_id?: UUID | null;
    organization_id?: UUID | null;
    entity_id?: UUID | null;
    entity_type?: EntityType | null;
    role?: MemberRoleType | null;
    extended?: boolean;
  };
}>;
export type GetMemberRoleResult = AgoraApiResponse<MemberRole>;
export type UpdateMemberRoleResult = AgoraApiResponse<MemberRole>;
export type DeleteMemberRoleResult = AgoraApiResponse<{ deleted: boolean }>;

// Organization members (extend existing OrgMember type with result wrappers)
export type CreateOrganizationMemberResult = AgoraApiResponse<OrgMember>;
export type GetOrganizationMembersResult = AgoraApiResponse<{
  organization_members: OrgMember[];
  count: number;
  filters_applied: { organization_id?: UUID | null; user_id?: UUID | null; extended?: boolean };
}>;
export type GetOrganizationMemberResult = AgoraApiResponse<OrgMember>;
export type UpdateOrganizationMemberResult = AgoraApiResponse<OrgMember>;
export type DeleteOrganizationMemberResult = AgoraApiResponse<{ deleted: boolean }>;

// Events (complements existing types)
export type UploadImageResult = AgoraApiResponse<{ url: string | null; updated: boolean }>;
export type UpdateEventResult = AgoraApiResponse<Event>;
export type DeleteEventResult = AgoraApiResponse<{ deleted: boolean }>;

// Event Social Links
export type GetEventSocialLinksResult = AgoraApiResponse<SocialLinks>;
export type UpdateEventSocialLinksResult = AgoraApiResponse<SocialLinks>;

// Users (token & me)
export type TokenData = { sub: string; exp?: number; iat?: number; [k: string]: unknown };
export type ReadTokenDataResult = AgoraApiResponse<TokenData>;
export type ReadMeResult = AgoraApiResponse<UserProfile>;

// User-Event relationship
export type UserEventHistoryItem = {
  state: UserEventState;
  notes: string | null;
  changed_at: ISODateTime;
  changed_by: UUID;
};
export type UserEvent = {
  id: UUID;
  event_id: UUID;
  user_id: UUID;
  origin: 'APPLIED' | 'INVITED' | string;
  profile_type: ProfileType | null;
  registered_at: ISODateTime | null;
  historial_state?: UserEventHistoryItem[]; // as named in API
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
};
export type CreateUserEventResult = AgoraApiResponse<UserEvent>;
export type GetUserEventsResult = AgoraApiResponse<{
  user_events: UserEvent[];
  count: number;
  filters_applied: {
    event_id?: UUID | null;
    user_id?: UUID | null;
    origin?: 'APPLIED' | 'INVITED' | string | null;
    profile_type?: ProfileType | null;
    state?: UserEventState | null;
  };
}>;
export type GetUserEventResult = AgoraApiResponse<UserEvent>;
export type UpdateUserEventResult = AgoraApiResponse<UserEvent>;
export type DeleteUserEventResult = AgoraApiResponse<{ deleted: boolean }>;
export type UpdateUserEventStateResult = AgoraApiResponse<UserEvent>;

// User-Sub-Event relationship
export type UserSubEvent = {
  id: UUID;
  user_id: UUID;
  sub_event_id: UUID;
  registered_at: ISODateTime | null;
  historial_state?: UserEventHistoryItem[];
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
};
export type CreateUserSubEventResult = AgoraApiResponse<UserSubEvent>;
export type GetUserSubEventsResult = AgoraApiResponse<{
  user_sub_events: UserSubEvent[];
  count: number;
  filters_applied: { user_id?: UUID | null; sub_event_id?: UUID | null };
}>;
export type GetUserSubEventResult = AgoraApiResponse<UserSubEvent>;
export type UpdateUserSubEventResult = AgoraApiResponse<UserSubEvent>;
export type DeleteUserSubEventResult = AgoraApiResponse<{ deleted: boolean }>;

// Analytics
export type RegistrationsDatapoint = {
  date: ISODate; // bucket date label
  count: number;
  cumulative_count: number;
};
export type ComparisonMeta = {
  start_date: ISODate;
  end_date: ISODate;
  interval: 'day' | 'week' | 'month' | 'year';
  bucket_days?: number | null;
};
export type Series = {
  id: UUID;
  name: string;
  data: RegistrationsDatapoint[];
};

export type OrganizationEventsComparison = {
  meta: ComparisonMeta;
  series: Series[]; // each series is an event
};
export type GetOrganizationEventsComparisonResult = AgoraApiResponse<OrganizationEventsComparison>;

export type EventSubEventsComparison = {
  meta: ComparisonMeta;
  series: Series[]; // each series is a sub-event
};
export type GetEventSubEventsComparisonResult = AgoraApiResponse<EventSubEventsComparison>;

export type OrganizationSummary = {
  organization_id: UUID;
  totals: {
    events: number;
    sub_events: number;
    members: number;
    attendees_unique: number;
  };
  breakdown: {
    FOUNDER: number;
    INVESTOR: number;
    ATTENDEE: number;
    total: number;
  };
};
export type GetOrganizationSummaryResult = AgoraApiResponse<OrganizationSummary>;

export type EventSummary = {
  event: { id: UUID; name: string; state: EventState };
  organization: { id: UUID; name: string };
  totals: {
    sub_events: number;
    attendees_unique: number;
  };
  breakdown: {
    FOUNDER: number;
    INVESTOR: number;
    ATTENDEE: number;
    total: number;
  };
};
export type GetEventSummaryResult = AgoraApiResponse<EventSummary>;

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

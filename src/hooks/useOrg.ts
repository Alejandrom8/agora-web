import { Organization, ListOrgEvents } from "@/lib/v1/types";
import useSWR from "swr";

export function useOrg(org_id: string) {
  const { data, error, isLoading } = useSWR<Organization>(`/api/dashboard/org/${org_id}`);
  return { organization: data ?? null, isLoading, error };
}

export function useOrgEvents(org_id: string) {
    const { data, error, isLoading } = useSWR<ListOrgEvents>(`/api/dashboard/org/${org_id}/events`);
    return { events: data?.events, isLoading, error };
}
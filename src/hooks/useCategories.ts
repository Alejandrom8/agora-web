import useSWR, { mutate } from 'swr';
import { CategoriesData } from '@/lib/bff/types';
import { buildUrl } from '@/lib/queryParams';

export interface UseCategoriesParams {
  skip?: number;
  limit?: number;
  parent_id?: string | null;
  root_only?: boolean;
  q?: string;
}

/**
 * Hook para obtener categorías con filtros
 */
export function useCategories(params: UseCategoriesParams = {}) {
  const url = buildUrl('/api/categories', params);
  
  const { data, error, isLoading } = useSWR<CategoriesData>(url);

  return {
    categories: data?.categories ?? [],
    count: data?.count ?? 0,
    filters_applied: data?.filters_applied,
    isLoading,
    isError: !!error,
    error,
    refresh: () => mutate(url),
  };
}


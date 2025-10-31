import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { EventsData } from '@/lib/bff/types';
import { buildUrl } from '@/lib/queryParams';
import { PAGINATION } from '@/config/constants';

export interface UseEventsParams {
  limit?: number;
  organization_id?: string;
  q?: string;
  state?: string;
  is_public?: boolean;
  full_response?: boolean;
  categories_id?: string;
}

export interface UseEventsWithPaginationParams extends UseEventsParams {
  /**
   * Si es true, el hook maneja la paginación internamente
   */
  withPagination?: boolean;
  /**
   * Número de items por página (solo si withPagination es true)
   */
  itemsPerPage?: number;
}

/**
 * Hook para obtener eventos con filtros y paginación opcional
 * 
 * @example
 * // Sin paginación manejada por el hook
 * const { events, count, isLoading } = useEvents({ q: 'react', skip: 0, limit: 12 });
 * 
 * @example
 * // Con paginación manejada por el hook
 * const { events, isLoading, page, setPage, totalPages } = useEvents({ 
 *   q: 'react', 
 *   withPagination: true,
 *   itemsPerPage: 12 
 * });
 */
export function useEvents(params: UseEventsWithPaginationParams = {}) {
  const {
    withPagination = true,
    itemsPerPage = PAGINATION.EVENTS_PER_PAGE,
    ...otherParams
  } = params;

  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE);

  // Calcular skip si se usa paginación
  const skip = withPagination ? (page - 1) * itemsPerPage : undefined;

  // Construir URL con todos los parámetros
  const url = buildUrl('/api/events', {
    ...otherParams,
    skip,
    limit: withPagination ? itemsPerPage : otherParams.limit,
    full_response: true,
  });

  const { data, error, isLoading } = useSWR<EventsData>(url);

  // Reset page cuando cambian los filtros
  useEffect(() => {
    if (withPagination) {
      setPage(PAGINATION.DEFAULT_PAGE);
    }
  }, [params.q, params.categories_id, params.state, params.is_public, withPagination]);

  const count = data?.count ?? 0;
  const totalPages = withPagination ? Math.ceil(count / itemsPerPage) : 0;

  return {
    events: data?.events ?? [],
    count,
    filters_applied: data?.filters_applied,
    isLoading,
    isError: !!error,
    error,
    refresh: () => mutate(url),
    // Propiedades de paginación (solo útiles si withPagination es true)
    page,
    setPage,
    totalPages,
  };
}


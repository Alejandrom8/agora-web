/**
 * Construye un query string a partir de un objeto de parámetros
 * 
 * @param params - Objeto con los parámetros
 * @returns String de query params (sin el '?' inicial)
 * 
 * @example
 * buildQueryString({ skip: 0, limit: 10, name: null })
 * // Returns: "skip=0&limit=10"
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Omitir valores null o undefined
    if (value === null || value === undefined) {
      return;
    }

    // Convertir el valor a string
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

/**
 * Construye una URL con query params
 * 
 * @param baseUrl - URL base
 * @param params - Objeto con los parámetros
 * @returns URL completa con query params
 * 
 * @example
 * buildUrl('/api/events', { skip: 0, limit: 10 })
 * // Returns: "/api/events?skip=0&limit=10"
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}


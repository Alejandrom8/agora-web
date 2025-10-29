/**
 * Constantes de configuración de la aplicación
 */

/**
 * Configuración de paginación
 */
export const PAGINATION = {
  EVENTS_PER_PAGE: 12,
  DEFAULT_PAGE: 1,
} as const;

/**
 * Configuración de debounce (en milisegundos)
 */
export const DEBOUNCE = {
  SEARCH: 600,
} as const;

/**
 * Límites de la aplicación
 */
export const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
} as const;


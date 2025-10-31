import { useEffect, useState } from 'react';

/**
 * Hook para aplicar debounce a un valor
 * 
 * @param value - Valor a aplicar debounce
 * @param delay - Tiempo de delay en milisegundos (default: 500ms)
 * @returns Valor con debounce aplicado
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 400);
 * 
 * useEffect(() => {
 *   // API call con debouncedSearchTerm
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Actualizar el valor con debounce después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar el timer si value cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook que combina useState con debounce
 * Retorna el valor inmediato, setter y el valor con debounce
 * 
 * @param initialValue - Valor inicial del estado
 * @param delay - Tiempo de delay en milisegundos (default: 500ms)
 * @returns Tupla con [value, setValue, debouncedValue]
 * 
 * @example
 * const [query, setQuery, debouncedQuery] = useDebouncedState('', 600);
 * 
 * // El input usa query y setQuery (responde inmediatamente)
 * <input value={query} onChange={(e) => setQuery(e.target.value)} />
 * 
 * // El API call usa debouncedQuery (espera 600ms después de escribir)
 * useEffect(() => {
 *   fetchData(debouncedQuery);
 * }, [debouncedQuery]);
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 500
): [T, (value: T) => void, T] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return [value, setValue, debouncedValue];
}


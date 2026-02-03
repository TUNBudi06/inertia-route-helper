import type { QueryParams } from '../types';

/**
 * Build URL query string from parameters object
 * Handles arrays as repeated parameters (e.g., tags[]=value1&tags[]=value2)
 * Filters out null and undefined values
 *
 * @param params - Query parameters object
 * @returns Query string with leading ? or empty string
 */
export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Skip null and undefined values
    if (value == null) return;

    // Handle arrays - append each value with [] suffix
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(`${key}[]`, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

import type { AnyRoute } from '../types';
import { route } from './route';

/**
 * Get just the URL string from a route definition
 * Convenience wrapper around route()
 *
 * @param routeDefinition - Route object
 * @returns Absolute URL string
 *
 * @example
 * ```typescript
 * const url = routeUrl({ url: '/users/123' });
 * // Returns: 'https://example.com/users/123'
 * ```
 */
export function routeUrl<T extends AnyRoute>(routeDefinition: T): string {
  return route(routeDefinition).url;
}

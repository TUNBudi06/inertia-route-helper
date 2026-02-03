import type { AnyRoute } from '../types';
import { getBaseUrl, getConfig } from '../state';

/**
 * Transform a route definition to include absolute URL
 * Automatically prepends base URL and handles trailing slashes
 *
 * @param routeDefinition - Route object with url property
 * @returns Route object with absolute URL
 *
 * @example
 * ```typescript
 * const dashboardRoute = route({ url: '/dashboard', method: 'GET' });
 * // Returns: { url: 'https://example.com/dashboard', method: 'GET' }
 * ```
 */
export function route<T extends AnyRoute>(routeDefinition: T): T {
  const base = getBaseUrl();
  const cfg = getConfig();

  let url = base + routeDefinition.url;

  // Add trailing slash if configured
  if (cfg.trailingSlash && !url.endsWith('/')) {
    url += '/';
  }

  return {
    ...routeDefinition,
    url,
  };
}

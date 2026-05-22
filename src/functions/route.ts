import type { AnyRoute } from '../types';
import { getConfig, resolveBasePath } from '../state';

/**
 * Transform a route definition to include absolute URL
 * Automatically prepends base URL and handles trailing slashes.
 * Deduplicates subfolder path if the route already contains it.
 *
 * @param routeDefinition - Route object with url property
 * @returns Route object with absolute URL
 *
 * @example
 * ```typescript
 * const dashboardRoute = route({ url: '/dashboard', method: 'GET' });
 * // Returns: { url: 'https://example.com/dashboard', method: 'GET' }
 *
 * // With subfolder deployment, routes already containing the subfolder
 * // are deduplicated automatically:
 * const dashboardRoute = route({ url: '/subfolder/public/dashboard' });
 * // Returns: { url: 'http://localhost/subfolder/public/dashboard', method: 'GET' }
 * ```
 */
export function route<T extends AnyRoute>(routeDefinition: T): T {
  const cfg = getConfig();

  let url = resolveBasePath(routeDefinition.url);

  // Add trailing slash if configured
  if (cfg.trailingSlash && !url.endsWith('/')) {
    url += '/';
  }

  return {
    ...routeDefinition,
    url,
  };
}

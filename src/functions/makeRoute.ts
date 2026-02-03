import type { RouteDefinition } from '../types';
import { buildRoute } from './buildRoute';

/**
 * Build route from a RouteDefinition object
 * Convenience wrapper for buildRoute with object syntax
 *
 * @param definition - Route definition with url, query, and fragment
 * @returns Complete URL string
 *
 * @example
 * ```typescript
 * makeRoute({
 *   url: '/posts',
 *   query: { status: 'published' },
 *   fragment: 'list'
 * });
 * // Returns: 'https://example.com/posts?status=published#list'
 * ```
 */
export function makeRoute(definition: RouteDefinition): string {
  return buildRoute(definition.url, {
    query: definition.query,
    fragment: definition.fragment,
    absolute: true,
  });
}

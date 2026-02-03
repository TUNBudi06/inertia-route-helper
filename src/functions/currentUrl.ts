/**
 * Get the complete current URL from browser location
 * SSR-safe (returns empty string on server)
 *
 * @returns Full URL including protocol, host, path, query, and fragment
 *
 * @example
 * ```typescript
 * const url = currentUrl();
 * // Returns: 'https://example.com/dashboard?tab=settings#content'
 * ```
 */
export function currentUrl(): string {
  return typeof window !== 'undefined' ? window.location.href : '';
}

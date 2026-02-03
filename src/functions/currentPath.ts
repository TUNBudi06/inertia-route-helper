/**
 * Get the current pathname from browser location
 * SSR-safe (returns empty string on server)
 *
 * @returns Current pathname (e.g., '/dashboard/settings')
 *
 * @example
 * ```typescript
 * const path = currentPath();
 * // Returns: '/dashboard/settings'
 * ```
 */
export function currentPath(): string {
  return typeof window !== 'undefined' ? window.location.pathname : '';
}

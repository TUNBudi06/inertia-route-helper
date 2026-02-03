/**
 * Check if a path matches the current browser location
 * Useful for highlighting active navigation items
 *
 * @param path - Path to check (e.g., '/dashboard')
 * @param useHost - Whether to include the baseUrl or not (default: false)
 * @param exact - Whether to match exactly (default: false for partial match)
 * @returns True if path matches current location
 *
 * @example
 * ```typescript
 * // Current URL: https://example.com/dashboard/settings
 *
 * isCurrentRoute('/dashboard');        // true (partial match)
 * isCurrentRoute('/dashboard', false, true);  // false (not exact)
 * isCurrentRoute('/dashboard/settings', false, true); // true (exact match)
 * isCurrentRoute('/dashboard', true); // true
 * isCurrentRoute('/dashboard/settings', true); // true
 * isCurrentRoute('https://example.com/dashboard', true); // true
 * isCurrentRoute('https://example.com/dashboard/settings', true, true); // true
 * isCurrentRoute('https://example.com/dashboard', true, true); // false
 * ```
 */
export function isCurrentRoute(path: string, useHost: boolean = false, exact: boolean = false): boolean {
  if (typeof window === 'undefined') return false;

  const currentPath = useHost ? window.location.href : window.location.pathname;

  return exact ? currentPath === path : currentPath.startsWith(path);
}

import { setBaseUrl } from '../state';

/**
 * Initialize route helper with Inertia props
 * Automatically extracts baseUrl from various data structures:
 * - props.initialPage.props.baseUrl (from createInertiaApp setup)
 * - page.props.baseUrl (from Svelte $page store)
 * - props.baseUrl (direct props)
 *
 * @param data - Can be props object, page object, or Svelte $page store
 *
 * @example
 * ```typescript
 * // React/Vue: Pass props from createInertiaApp
 * createInertiaApp({
 *   setup({ el, App, props }) {
 *     initRouteHelper(props);
 *   }
 * });
 *
 * // Svelte: Can pass props or use $page
 * import { page } from '@inertiajs/svelte';
 * initRouteHelper(props); // or initRouteHelper($page)
 * ```
 */
export function initRouteHelper(data: any): void {
  if (!data) return;

  let url: string | null = null;

  // Try to extract baseUrl from different structures
  // 1. Try: props.initialPage.props.baseUrl (createInertiaApp props)
  url = data?.initialPage?.props?.baseUrl;

  // 2. Try: page.props.baseUrl (Svelte $page store or direct page object)
  if (!url) {
    url = data?.props?.baseUrl;
  }

  // 3. Try: direct baseUrl (if passed directly)
  if (!url) {
    url = data?.baseUrl;
  }

  // Set baseUrl if found and valid
  if (url && typeof url === 'string') {
    setBaseUrl(url);
  }
}

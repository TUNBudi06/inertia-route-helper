import { router } from '@inertiajs/core';
import type { RouteHelperConfig } from './types';

let baseUrl = '';
let config: RouteHelperConfig = {
  trailingSlash: false,
  validateRoutes: false,
};

// Listen to Inertia navigation events to get baseUrl from shared props
if (typeof window !== 'undefined') {
  router.on('navigate', (event) => {
    const url = (event.detail.page.props as any)?.baseUrl;
    if (typeof url === 'string') {
      baseUrl = url.replace(/\/$/, '');
    }
  });

  // Also try to get it from initial page load
  try {
    // @ts-ignore - Access Inertia page if available
    const initialUrl = window?.Inertia?.page?.props?.baseUrl;
    if (typeof initialUrl === 'string') {
      baseUrl = initialUrl.replace(/\/$/, '');
    }
  } catch (e) {
    // Silently fail - baseUrl will be detected on first navigation
  }
}

export function getBaseUrl(): string {
  return baseUrl;
}

export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, '');
}

export function configure(options: RouteHelperConfig): void {
  config = { ...config, ...options };
  if (options.baseUrl) {
    setBaseUrl(options.baseUrl);
  }
}

export function getConfig(): RouteHelperConfig {
  return config;
}

export { configure as configureRouteHelper };


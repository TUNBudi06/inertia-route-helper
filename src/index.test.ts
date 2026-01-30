import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  route,
  routeUrl,
  buildRoute,
  makeRoute,
  isCurrentRoute,
  currentPath,
  currentUrl,
  configure,
  setBaseUrl,
} from './index';

// Mock the router
vi.mock('@inertiajs/core', () => ({
  router: {
    on: vi.fn(),
  },
}));

describe('route functions', () => {
  beforeEach(() => {
    setBaseUrl('https://example.com');
    configure({ trailingSlash: false, validateRoutes: false });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
        pathname: '/dashboard',
        href: 'https://example.com/dashboard',
      },
      writable: true,
    });
  });

  afterEach(() => {
    setBaseUrl('');
  });

  describe('route', () => {
    it('should return route with absolute URL', () => {
      const result = route({ url: '/users' });
      expect(result.url).toBe('https://example.com/users');
    });

    it('should preserve additional properties', () => {
      const result = route({ url: '/users', method: 'GET', name: 'users' });
      expect(result.method).toBe('GET');
      expect(result.name).toBe('users');
    });

    it('should auto-detect from window.location if baseUrl is not set', () => {
      setBaseUrl(''); // Clear base URL

      // Set window.location for auto-detection
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'https:',
          hostname: 'example.com',
          port: '',
          origin: 'https://example.com',
          pathname: '/dashboard',
          href: 'https://example.com/dashboard',
        },
        writable: true,
        configurable: true,
      });

      const result = route({ url: '/dashboard' });
      expect(result.url).toBe('https://example.com/dashboard');
    });

    it('should add trailing slash when configured', () => {
      configure({ trailingSlash: true });
      const result = route({ url: '/users' });
      expect(result.url).toBe('https://example.com/users/');
    });

    it('should not add trailing slash if URL already has one', () => {
      configure({ trailingSlash: true });
      const result = route({ url: '/users/' });
      expect(result.url).toBe('https://example.com/users/');
    });

    it('should handle subfolder base URL', () => {
      setBaseUrl('https://example.com/subfolder');
      const result = route({ url: '/users' });
      expect(result.url).toBe('https://example.com/subfolder/users');
    });
  });

  describe('routeUrl', () => {
    it('should return just the URL string', () => {
      const url = routeUrl({ url: '/users' });
      expect(url).toBe('https://example.com/users');
    });

    it('should handle route with parameters', () => {
      const url = routeUrl({ url: '/users/42', params: { id: 42 } });
      expect(url).toBe('https://example.com/users/42');
    });
  });

  describe('buildRoute', () => {
    it('should build route without options', () => {
      const url = buildRoute('/users');
      expect(url).toBe('https://example.com/users');
    });

    it('should build route with query parameters', () => {
      const url = buildRoute('/search', {
        query: { q: 'test', page: 2 },
      });
      expect(url).toBe('https://example.com/search?q=test&page=2');
    });

    it('should build route with array query parameters', () => {
      const url = buildRoute('/filter', {
        query: { tags: ['featured', 'new'] },
      });
      // URL encoding will encode [] as %5B%5D which is correct
      expect(url).toContain('tags%5B%5D=featured');
      expect(url).toContain('tags%5B%5D=new');
    });

    it('should handle null and undefined query values', () => {
      const url = buildRoute('/search', {
        query: { q: 'test', filter: null, sort: undefined },
      });
      expect(url).toBe('https://example.com/search?q=test');
    });

    it('should build route with fragment', () => {
      const url = buildRoute('/page', {
        fragment: 'section-1',
      });
      expect(url).toBe('https://example.com/page#section-1');
    });

    it('should build route with query and fragment', () => {
      const url = buildRoute('/search', {
        query: { q: 'test' },
        fragment: 'results',
      });
      expect(url).toBe('https://example.com/search?q=test#results');
    });

    it('should build relative route when absolute is false', () => {
      const url = buildRoute('/users', { absolute: false });
      expect(url).toBe('/users');
    });

    it('should handle relative route with query parameters', () => {
      const url = buildRoute('/search', {
        query: { q: 'test' },
        absolute: false,
      });
      expect(url).toBe('/search?q=test');
    });

    it('should handle complex query parameters', () => {
      const url = buildRoute('/api/items', {
        query: {
          search: 'hello world',
          filters: ['active', 'verified'],
          page: 1,
          limit: 10,
          enabled: true,
        },
      });
      expect(url).toContain('search=hello+world');
      expect(url).toContain('filters%5B%5D=active');
      expect(url).toContain('filters%5B%5D=verified');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=10');
      expect(url).toContain('enabled=true');
    });

    it('should add trailing slash when configured', () => {
      configure({ trailingSlash: true });
      const url = buildRoute('/users');
      expect(url).toBe('https://example.com/users/');
    });

    it('should not add trailing slash with query parameters', () => {
      configure({ trailingSlash: true });
      const url = buildRoute('/users', { query: { page: 1 } });
      expect(url).toBe('https://example.com/users?page=1');
    });
  });

  describe('makeRoute', () => {
    it('should build route from definition', () => {
      const url = makeRoute({ url: '/users' });
      expect(url).toBe('https://example.com/users');
    });

    it('should build route with all options', () => {
      const url = makeRoute({
        url: '/search',
        query: { q: 'test', page: 2 },
        fragment: 'results',
      });
      expect(url).toBe('https://example.com/search?q=test&page=2#results');
    });

    it('should handle route definition with extra properties', () => {
      const url = makeRoute({
        url: '/users',
        query: { active: true },
        method: 'GET', // Extra property should not affect URL
        name: 'users.index',
      });
      expect(url).toBe('https://example.com/users?active=true');
    });
  });

  describe('isCurrentRoute', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/dashboard/settings',
        },
        writable: true,
      });
    });

    it('should return true for partial match', () => {
      expect(isCurrentRoute('/dashboard')).toBe(true);
    });

    it('should return false for non-matching path', () => {
      expect(isCurrentRoute('/users')).toBe(false);
    });

    it('should return true for exact match when exact is true', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard' },
        writable: true,
      });
      expect(isCurrentRoute('/dashboard', true)).toBe(true);
    });

    it('should return false for partial match when exact is true', () => {
      expect(isCurrentRoute('/dashboard', true)).toBe(false);
    });

    it('should handle root path', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true,
      });
      expect(isCurrentRoute('/', true)).toBe(true);
    });

    it('should handle paths with trailing slash', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard/' },
        writable: true,
      });
      expect(isCurrentRoute('/dashboard')).toBe(true);
    });
  });

  describe('currentPath', () => {
    it('should return current pathname', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard/profile' },
        writable: true,
      });
      expect(currentPath()).toBe('/dashboard/profile');
    });

    it('should return empty string in SSR context', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(currentPath()).toBe('');
      global.window = originalWindow;
    });
  });

  describe('currentUrl', () => {
    it('should return current full URL', () => {
      Object.defineProperty(window, 'location', {
        value: { href: 'https://example.com/dashboard?tab=settings' },
        writable: true,
      });
      expect(currentUrl()).toBe('https://example.com/dashboard?tab=settings');
    });

    it('should return empty string in SSR context', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(currentUrl()).toBe('');
      global.window = originalWindow;
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty path', () => {
      const url = buildRoute('');
      expect(url).toBe('https://example.com');
    });

    it('should handle path without leading slash', () => {
      const url = buildRoute('users');
      expect(url).toBe('https://example.comusers');
    });

    it('should handle special characters in query parameters', () => {
      const url = buildRoute('/search', {
        query: { q: 'hello & goodbye' },
      });
      expect(url).toContain('hello+%26+goodbye');
    });

    it('should handle boolean query parameters', () => {
      const url = buildRoute('/filter', {
        query: { active: true, archived: false },
      });
      expect(url).toContain('active=true');
      expect(url).toContain('archived=false');
    });

    it('should handle number query parameters', () => {
      const url = buildRoute('/items', {
        query: { page: 1, limit: 100 },
      });
      expect(url).toContain('page=1');
      expect(url).toContain('limit=100');
    });

    it('should handle empty query object', () => {
      const url = buildRoute('/users', { query: {} });
      expect(url).toBe('https://example.com/users');
    });

    it('should handle empty fragment', () => {
      const url = buildRoute('/page', { fragment: '' });
      expect(url).toBe('https://example.com/page');
    });
  });

  describe('SSR safety', () => {
    it('should handle missing window object gracefully', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      setBaseUrl('https://ssr.example.com');
      const url = routeUrl({ url: '/users' });
      expect(url).toBe('https://ssr.example.com/users');

      global.window = originalWindow;
    });

    it('should not throw when checking current route without window', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => isCurrentRoute('/dashboard')).not.toThrow();
      expect(isCurrentRoute('/dashboard')).toBe(false);

      global.window = originalWindow;
    });
  });
});

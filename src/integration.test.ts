import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  getBaseUrl,
} from './index';

// Mock the router
vi.mock('@inertiajs/core', () => ({
  router: {
    on: vi.fn(),
  },
}));

describe('Integration Tests - Real-world Scenarios', () => {
  beforeEach(() => {
    // Reset everything
    setBaseUrl('https://example.com');
    configure({ trailingSlash: false, validateRoutes: false });

    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
        pathname: '/dashboard',
        href: 'https://example.com/dashboard',
      },
      writable: true,
    });
  });

  describe('Scenario: E-commerce Product Filtering', () => {
    it('should build product filter URL with multiple parameters', () => {
      const url = buildRoute('/products', {
        query: {
          category: 'electronics',
          brands: ['Apple', 'Samsung', 'Sony'],
          minPrice: 100,
          maxPrice: 1000,
          inStock: true,
          sort: 'price-asc',
        },
      });

      expect(url).toContain('/products?');
      expect(url).toContain('category=electronics');
      expect(url).toContain('brands%5B%5D=Apple');
      expect(url).toContain('brands%5B%5D=Samsung');
      expect(url).toContain('brands%5B%5D=Sony');
      expect(url).toContain('minPrice=100');
      expect(url).toContain('maxPrice=1000');
      expect(url).toContain('inStock=true');
      expect(url).toContain('sort=price-asc');
    });
  });

  describe('Scenario: Blog Pagination with Search', () => {
    it('should build paginated search URL', () => {
      const url = buildRoute('/blog', {
        query: {
          q: 'laravel inertia',
          page: 3,
          perPage: 20,
          tags: ['tutorial', 'beginner'],
        },
        fragment: 'results',
      });

      expect(url).toContain('q=laravel+inertia');
      expect(url).toContain('page=3');
      expect(url).toContain('perPage=20');
      expect(url).toContain('tags%5B%5D=tutorial');
      expect(url).toContain('tags%5B%5D=beginner');
      expect(url).toContain('#results');
    });
  });

  describe('Scenario: Navigation Menu with Active States', () => {
    it('should correctly identify active menu items', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard/settings/profile' },
        writable: true,
      });

      // Dashboard menu (partial match)
      expect(isCurrentRoute('/dashboard')).toBe(true);

      // Settings submenu (partial match)
      expect(isCurrentRoute('/dashboard/settings')).toBe(true);

      // Profile page (exact match)
      expect(isCurrentRoute('/dashboard/settings/profile', false, true)).toBe(true);

      // Other menu items (no match)
      expect(isCurrentRoute('/users')).toBe(false);
      expect(isCurrentRoute('/posts')).toBe(false);
    });
  });

  describe('Scenario: Subfolder Deployment', () => {
    beforeEach(() => {
      setBaseUrl('https://example.com/my-app');
    });

    it('should correctly prepend subfolder to all routes', () => {
      expect(routeUrl({ url: '/dashboard' })).toBe('https://example.com/my-app/dashboard');
      expect(routeUrl({ url: '/users/42' })).toBe('https://example.com/my-app/users/42');
      expect(routeUrl({ url: '/api/posts' })).toBe('https://example.com/my-app/api/posts');
    });

    it('should handle query parameters with subfolder', () => {
      const url = buildRoute('/search', {
        query: { q: 'test' },
      });
      expect(url).toBe('https://example.com/my-app/search?q=test');
    });
  });

  describe('Scenario: API Route Building', () => {
    it('should build API routes with authentication tokens', () => {
      const url = buildRoute('/api/users', {
        query: {
          token: 'abc123',
          include: ['profile', 'posts', 'comments'],
          fields: 'id,name,email',
        },
      });

      expect(url).toContain('/api/users?');
      expect(url).toContain('token=abc123');
      expect(url).toContain('include%5B%5D=profile');
      expect(url).toContain('include%5B%5D=posts');
      expect(url).toContain('include%5B%5D=comments');
      expect(url).toContain('fields=id%2Cname%2Cemail');
    });
  });

  describe('Scenario: Form Submission URLs', () => {
    it('should generate form action URLs', () => {
      const createUrl = routeUrl({ url: '/posts', method: 'POST' });
      expect(createUrl).toBe('https://example.com/posts');

      const updateUrl = routeUrl({ url: '/posts/42', method: 'PUT' });
      expect(updateUrl).toBe('https://example.com/posts/42');

      const deleteUrl = routeUrl({ url: '/posts/42', method: 'DELETE' });
      expect(deleteUrl).toBe('https://example.com/posts/42');
    });
  });

  describe('Scenario: Social Media Share URLs', () => {
    it('should build share URLs with proper encoding', () => {
      const articleUrl = 'https://example.com/blog/awesome-article';
      const articleTitle = 'Check out this awesome article!';

      const twitterUrl = buildRoute('https://twitter.com/intent/tweet', {
        query: {
          url: articleUrl,
          text: articleTitle,
        },
        absolute: false,
      });

      expect(twitterUrl).toContain('url=https%3A%2F%2Fexample.com%2Fblog%2Fawesome-article');
      expect(twitterUrl).toContain('text=Check+out+this+awesome+article%21');
    });
  });

  describe('Scenario: Multi-step Form with Step Navigation', () => {
    it('should navigate between form steps', () => {
      const step1Url = buildRoute('/register', { query: { step: 1 } });
      const step2Url = buildRoute('/register', { query: { step: 2 } });
      const step3Url = buildRoute('/register', { query: { step: 3 } });

      expect(step1Url).toBe('https://example.com/register?step=1');
      expect(step2Url).toBe('https://example.com/register?step=2');
      expect(step3Url).toBe('https://example.com/register?step=3');
    });
  });

  describe('Scenario: Calendar Event Filtering', () => {
    it('should build calendar filter URL', () => {
      const url = buildRoute('/calendar', {
        query: {
          year: 2026,
          month: 1,
          view: 'month',
          categories: ['meeting', 'deadline', 'event'],
        },
        fragment: 'day-30',
      });

      expect(url).toContain('year=2026');
      expect(url).toContain('month=1');
      expect(url).toContain('view=month');
      expect(url).toContain('categories%5B%5D=meeting');
      expect(url).toContain('#day-30');
    });
  });

  describe('Scenario: Configuration Changes', () => {
    it('should apply trailing slash configuration globally', () => {
      configure({ trailingSlash: true });

      expect(routeUrl({ url: '/users' })).toBe('https://example.com/users/');
      expect(routeUrl({ url: '/posts' })).toBe('https://example.com/posts/');
      expect(buildRoute('/api/data')).toBe('https://example.com/api/data/');

      // Should not add trailing slash with query params
      expect(buildRoute('/search', { query: { q: 'test' } }))
        .toBe('https://example.com/search?q=test');
    });

    it('should allow base URL override', () => {
      configure({ baseUrl: 'https://api.example.com' });

      expect(getBaseUrl()).toBe('https://api.example.com');
      expect(routeUrl({ url: '/users' })).toBe('https://api.example.com/users');
    });
  });

  describe('Scenario: Breadcrumb Generation', () => {
    it('should identify current path segments', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard/projects/123/tasks' },
        writable: true,
      });

      const path = currentPath();
      const segments = path.split('/').filter(Boolean);

      expect(segments).toEqual(['dashboard', 'projects', '123', 'tasks']);
      expect(isCurrentRoute('/dashboard')).toBe(true);
      expect(isCurrentRoute('/dashboard/projects')).toBe(true);
      expect(isCurrentRoute('/dashboard/projects/123')).toBe(true);
    });
  });

  describe('Scenario: Ziggy/Wayfinder Integration', () => {
    it('should work with Ziggy-style route definitions', () => {
      const ziggyRoute = {
        url: '/users/42',
        method: 'GET',
        name: 'users.show',
        params: { user: 42 },
      };

      const url = routeUrl(ziggyRoute);
      expect(url).toBe('https://example.com/users/42');
    });

    it('should work with Wayfinder-style route definitions', () => {
      const wayfinderRoute = {
        url: '/posts/123/comments/456',
        method: 'PATCH',
        name: 'posts.comments.update',
        params: { post: 123, comment: 456 },
      };

      const fullRoute = route(wayfinderRoute);
      expect(fullRoute.url).toBe('https://example.com/posts/123/comments/456');
      expect(fullRoute.method).toBe('PATCH');
      expect(fullRoute.name).toBe('posts.comments.update');
    });
  });

  describe('Scenario: Relative vs Absolute URLs', () => {
    it('should generate both relative and absolute URLs', () => {
      const absoluteUrl = buildRoute('/api/users', { absolute: true });
      const relativeUrl = buildRoute('/api/users', { absolute: false });

      expect(absoluteUrl).toBe('https://example.com/api/users');
      expect(relativeUrl).toBe('/api/users');
    });

    it('should handle relative URLs with query parameters', () => {
      const url = buildRoute('/search', {
        query: { q: 'test', page: 2 },
        absolute: false,
      });

      expect(url).toBe('/search?q=test&page=2');
    });
  });

  describe('Scenario: Empty and Null Value Handling', () => {
    it('should omit null and undefined query parameters', () => {
      const url = buildRoute('/filter', {
        query: {
          category: 'electronics',
          brand: null,
          minPrice: undefined,
          maxPrice: 1000,
        },
      });

      expect(url).toBe('https://example.com/filter?category=electronics&maxPrice=1000');
      expect(url).not.toContain('brand');
      expect(url).not.toContain('minPrice');
    });

    it('should handle empty strings', () => {
      const url = buildRoute('/search', {
        query: { q: '', category: 'all' },
      });

      expect(url).toContain('q=');
      expect(url).toContain('category=all');
    });
  });

  describe('Scenario: Complex Real-world Application', () => {
    it('should handle dashboard with multiple filters and pagination', () => {
      setBaseUrl('https://app.example.com/admin');

      const dashboardUrl = buildRoute('/dashboard', {
        query: {
          date_from: '2026-01-01',
          date_to: '2026-01-31',
          status: ['active', 'pending', 'completed'],
          search: 'project',
          sort: 'created_at',
          order: 'desc',
          page: 2,
          per_page: 25,
        },
        fragment: 'results-table',
      });

      expect(dashboardUrl).toContain('https://app.example.com/admin/dashboard?');
      expect(dashboardUrl).toContain('date_from=2026-01-01');
      expect(dashboardUrl).toContain('date_to=2026-01-31');
      expect(dashboardUrl).toContain('status%5B%5D=active');
      expect(dashboardUrl).toContain('status%5B%5D=pending');
      expect(dashboardUrl).toContain('status%5B%5D=completed');
      expect(dashboardUrl).toContain('search=project');
      expect(dashboardUrl).toContain('sort=created_at');
      expect(dashboardUrl).toContain('order=desc');
      expect(dashboardUrl).toContain('page=2');
      expect(dashboardUrl).toContain('per_page=25');
      expect(dashboardUrl).toContain('#results-table');
    });
  });
});

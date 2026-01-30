# API Reference - inertia-route-helper

Complete API documentation for all functions and types.

---

## Table of Contents

- [Initialization](#initialization)
- [Core Route Functions](#core-route-functions)
- [Navigation Helpers](#navigation-helpers)
- [Configuration](#configuration)
- [Advanced Functions](#advanced-functions)
- [TypeScript Types](#typescript-types)

---

## Initialization

### `initRouteHelper(data)`

Initialize the route helper with Inertia props. Automatically extracts `baseUrl` from various data structures.

**Signature:**
```typescript
function initRouteHelper(data: any): void
```

**Parameters:**
- `data` - Can be props from `createInertiaApp`, Svelte `$page` store, or any object containing baseUrl

**Supports Multiple Structures:**
1. `props.initialPage.props.baseUrl` - React/Vue createInertiaApp props
2. `page.props.baseUrl` - Svelte $page store
3. `data.baseUrl` - Direct object

**Examples:**

```typescript
// React/Vue - Pass props from createInertiaApp
import { createInertiaApp } from '@inertiajs/react';
import { initRouteHelper } from 'inertia-route-helper';

createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    // ...
  }
});

// Svelte - Can use props or $page
import { page } from '@inertiajs/svelte';
import { initRouteHelper } from 'inertia-route-helper';

initRouteHelper(props);  // or
initRouteHelper($page);
```

---

## Core Route Functions

### `route(routeDefinition)`

Transform a route definition to include absolute URL with base URL prepended.

**Signature:**
```typescript
function route<T extends AnyRoute>(routeDefinition: T): T
```

**Parameters:**
- `routeDefinition` - Route object with `url` property (from Ziggy/Wayfinder)

**Returns:**
- Route object with absolute URL and all other properties preserved

**Examples:**

```typescript
import { route } from 'inertia-route-helper';

// Simple route
const dashboardRoute = route({ url: '/dashboard', method: 'GET' });
// { url: 'https://example.com/dashboard', method: 'GET' }

// With Ziggy
import { dashboard } from '@/routes';
const route = route(dashboard());
// { url: 'https://example.com/dashboard', ...ziggyProps }
```

---

### `routeUrl(routeDefinition)`

Get just the URL string from a route definition. Convenience wrapper around `route()`.

**Signature:**
```typescript
function routeUrl<T extends AnyRoute>(routeDefinition: T): string
```

**Parameters:**
- `routeDefinition` - Route object with `url` property

**Returns:**
- Absolute URL string

**Examples:**

```typescript
import { routeUrl } from 'inertia-route-helper';
import { users, posts } from '@/routes';

// Simple URL
const url = routeUrl({ url: '/users' });
// 'https://example.com/users'

// With parameters
const userUrl = routeUrl(users.show({ id: 123 }));
// 'https://example.com/users/123'

// Complex route
const postUrl = routeUrl(posts.edit({ post: 10, comment: 5 }));
// 'https://example.com/posts/10/comments/5/edit'
```

---

### `buildRoute(path, options?)`

Build a complete URL with query parameters and fragment. Most flexible URL builder.

**Signature:**
```typescript
function buildRoute(
  path: string,
  options?: {
    query?: QueryParams;
    fragment?: string;
    absolute?: boolean;
  }
): string
```

**Parameters:**
- `path` - Base path (e.g., '/search' or '/users/123')
- `options` - Optional configuration object
  - `query?` - Query parameters object (supports arrays)
  - `fragment?` - Fragment/hash identifier (without #)
  - `absolute?` - Whether to include base URL (default: `true`)

**Returns:**
- Complete URL string

**Examples:**

```typescript
import { buildRoute } from 'inertia-route-helper';

// Simple query parameters
const url1 = buildRoute('/search', {
  query: { q: 'test', page: 2 }
});
// 'https://example.com/search?q=test&page=2'

// With fragment
const url2 = buildRoute('/docs', {
  query: { section: 'api' },
  fragment: 'overview'
});
// 'https://example.com/docs?section=api#overview'

// Array parameters (repeated)
const url3 = buildRoute('/products', {
  query: {
    tags: ['new', 'featured', 'sale'],
    colors: ['red', 'blue']
  }
});
// 'https://example.com/products?tags[]=new&tags[]=featured&tags[]=sale&colors[]=red&colors[]=blue'

// Relative URL (no base URL)
const url4 = buildRoute('/api/users', { absolute: false });
// '/api/users'

// Null/undefined values are filtered out
const url5 = buildRoute('/search', {
  query: {
    q: 'test',
    page: null,      // Ignored
    filter: undefined // Ignored
  }
});
// 'https://example.com/search?q=test'
```

---

### `makeRoute(definition)`

Build route from a RouteDefinition object. Convenience wrapper for `buildRoute()` with object syntax.

**Signature:**
```typescript
function makeRoute(definition: RouteDefinition): string
```

**Parameters:**
- `definition` - Route definition object with `url`, optional `query`, and optional `fragment`

**Returns:**
- Complete URL string (always absolute)

**Examples:**

```typescript
import { makeRoute } from 'inertia-route-helper';

// Simple route with query
const url1 = makeRoute({
  url: '/posts',
  query: { status: 'published' }
});
// 'https://example.com/posts?status=published'

// With query and fragment
const url2 = makeRoute({
  url: '/docs',
  query: { section: 'api' },
  fragment: 'authentication'
});
// 'https://example.com/docs?section=api#authentication'

// Complex filters
const url3 = makeRoute({
  url: '/products',
  query: {
    category: 'electronics',
    brands: ['apple', 'samsung'],
    minPrice: 100,
    maxPrice: 1000
  }
});
// 'https://example.com/products?category=electronics&brands[]=apple&brands[]=samsung&minPrice=100&maxPrice=1000'
```

---

## Navigation Helpers

### `isCurrentRoute(path, exact?)`

Check if a path matches the current browser location. Useful for highlighting active navigation items.

**Signature:**
```typescript
function isCurrentRoute(path: string, exact?: boolean): boolean
```

**Parameters:**
- `path` - Path to check (e.g., '/dashboard')
- `exact?` - Whether to match exactly (default: `false` for partial match)

**Returns:**
- `true` if path matches current location, `false` otherwise
- Returns `false` in SSR context (no window)

**Examples:**

```typescript
import { isCurrentRoute } from 'inertia-route-helper';

// Assuming current URL: https://example.com/dashboard/settings

// Partial match (default)
isCurrentRoute('/dashboard');         // true
isCurrentRoute('/dashboard/settings'); // true
isCurrentRoute('/users');              // false

// Exact match
isCurrentRoute('/dashboard', true);          // false (not exact)
isCurrentRoute('/dashboard/settings', true); // true (exact match)

// Use in React component
function NavLink({ href, children }) {
  const isActive = isCurrentRoute(href);
  
  return (
    <a
      href={href}
      className={isActive ? 'active' : ''}
    >
      {children}
    </a>
  );
}

// Use in Vue component
<template>
  <a
    :href="href"
    :class="{ active: isCurrentRoute(href) }"
  >
    {{ label }}
  </a>
</template>

// Use in Svelte component
<a
  href={href}
  class:active={isCurrentRoute(href)}
>
  {label}
</a>
```

---

### `currentPath()`

Get the current pathname from browser location. SSR-safe.

**Signature:**
```typescript
function currentPath(): string
```

**Returns:**
- Current pathname (e.g., '/dashboard/settings')
- Returns empty string in SSR context

**Examples:**

```typescript
import { currentPath } from 'inertia-route-helper';

const path = currentPath();
// '/dashboard/settings'

// Use for breadcrumbs
const segments = currentPath().split('/').filter(Boolean);
// ['dashboard', 'settings']

// Conditional rendering
if (currentPath().startsWith('/admin')) {
  // Show admin menu
}
```

---

### `currentUrl()`

Get the complete current URL from browser location. SSR-safe.

**Signature:**
```typescript
function currentUrl(): string
```

**Returns:**
- Full URL including protocol, host, path, query, and fragment
- Returns empty string in SSR context

**Examples:**

```typescript
import { currentUrl } from 'inertia-route-helper';

const url = currentUrl();
// 'https://example.com/dashboard/settings?tab=profile#personal-info'

// Use for sharing
function shareCurrentPage() {
  const shareUrl = currentUrl();
  navigator.share({ url: shareUrl });
}

// Debug logging
console.log('Current URL:', currentUrl());
```

---

## Configuration

### `configure(options)`

Configure route helper behavior globally.

**Signature:**
```typescript
function configure(options: RouteHelperConfig): void
```

**Parameters:**
- `options` - Configuration object
  - `baseUrl?` - Override base URL
  - `trailingSlash?` - Add trailing slash to URLs (default: `false`)
  - `validateRoutes?` - Enable route validation (default: `false`)

**Examples:**

```typescript
import { configure } from 'inertia-route-helper';

// Basic configuration
configure({
  baseUrl: 'https://custom-domain.com'
});

// With trailing slashes
configure({
  trailingSlash: true
});
// Now all URLs will have trailing slashes:
// 'https://example.com/dashboard/' instead of 'https://example.com/dashboard'

// Full configuration
configure({
  baseUrl: 'https://api.example.com',
  trailingSlash: false,
  validateRoutes: false
});

// Update specific option
configure({ trailingSlash: true });
// Other options remain unchanged
```

---

## Advanced Functions

### `setBaseUrl(url)`

Manually set the base URL. Useful for testing or advanced use cases.

**Signature:**
```typescript
function setBaseUrl(url: string): void
```

**Parameters:**
- `url` - Base URL string (trailing slash will be removed automatically)

**Examples:**

```typescript
import { setBaseUrl } from 'inertia-route-helper';

// Set custom base URL
setBaseUrl('https://example.com');

// For testing
beforeEach(() => {
  setBaseUrl('https://test.example.com');
});

// Subfolder deployment
setBaseUrl('https://example.com/my-app');
```

---

### `getBaseUrl()`

Get the current base URL.

**Signature:**
```typescript
function getBaseUrl(): string
```

**Returns:**
- Current base URL string
- Auto-detects from `window.location` if not set

**Examples:**

```typescript
import { getBaseUrl } from 'inertia-route-helper';

const baseUrl = getBaseUrl();
// 'https://example.com'

// Check configuration
console.log('Using base URL:', getBaseUrl());

// Build custom URLs
const apiUrl = `${getBaseUrl()}/api/v1`;
```

---

## TypeScript Types

### `AnyRoute`

Base type for route definitions.

```typescript
type AnyRoute = {
  url: string;
  [key: string]: any;
}
```

---

### `RouteDefinition`

Complete route definition with optional query and fragment.

```typescript
type RouteDefinition = {
  url: string;
  query?: QueryParams;
  fragment?: string;
  [key: string]: any;
}
```

---

### `QueryParams`

Query parameters object type.

```typescript
type QueryParams = {
  [key: string]: string | number | boolean | (string | number)[] | null | undefined;
}
```

**Examples:**

```typescript
// Simple params
const params1: QueryParams = {
  q: 'search term',
  page: 2,
  active: true
};

// Array params
const params2: QueryParams = {
  tags: ['laravel', 'vue', 'inertia'],
  ids: [1, 2, 3]
};

// Mixed with null (filtered out)
const params3: QueryParams = {
  search: 'test',
  filter: null,      // Will be ignored
  sort: undefined    // Will be ignored
};
```

---

### `RouteParams`

Route parameters type (for Ziggy/Wayfinder compatibility).

```typescript
type RouteParams = Record<string, any>
```

---

### `RouteHelperConfig`

Configuration options type.

```typescript
type RouteHelperConfig = {
  baseUrl?: string;
  trailingSlash?: boolean;
  validateRoutes?: boolean;
}
```

---

## Complete Import Reference

```typescript
// Functions
import {
  initRouteHelper,
  route,
  routeUrl,
  buildRoute,
  makeRoute,
  isCurrentRoute,
  currentPath,
  currentUrl,
  configure,
  setBaseUrl,
  getBaseUrl
} from 'inertia-route-helper';

// Types
import type {
  AnyRoute,
  RouteDefinition,
  QueryParams,
  RouteParams,
  RouteHelperConfig
} from 'inertia-route-helper';
```

---

## SSR Safety

All navigation helper functions are SSR-safe:

- `isCurrentRoute()` - Returns `false` in SSR context
- `currentPath()` - Returns empty string in SSR context
- `currentUrl()` - Returns empty string in SSR context

Core route building functions work in both SSR and client contexts.

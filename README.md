# 🚀 Inertia Route Helper

<div align="center">

[![npm version](https://img.shields.io/npm/v/inertia-route-helper.svg)](https://www.npmjs.com/package/inertia-route-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Powerful routing helper for Inertia.js v2 applications**

Work seamlessly with Laravel Ziggy or Wayfinder routes, with full support for subfolder deployments, query parameters, and route validation.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Reference](#-api-reference) • [Examples](#-examples)

</div>

---

## ✨ Features

- 🔗 **Absolute URL Generation** - Automatically prepends your base URL to all routes
- 📁 **Subfolder Deployment Support** - Perfect for apps deployed in subfolders
- 🔍 **Query Parameters** - Build routes with query strings effortlessly
- 🎯 **Route Validation** - Check if routes match the current path
- 🎨 **TypeScript First** - Full type safety and IntelliSense support
- ⚡ **Inertia.js v2** - Built for the latest Inertia.js version
- 🌐 **SSR Safe** - Works perfectly with server-side rendering
- 🪶 **Lightweight** - Zero dependencies (except Inertia.js peer)
- ⚙️ **Configurable** - Customize behavior to fit your needs

---

## 📦 Installation

```bash
npm install inertia-route-helper
```

```bash
yarn add inertia-route-helper
```

```bash
pnpm add inertia-route-helper
```

---

## 🚀 Quick Start

### Laravel Setup

Share your base URL with Inertia in your Laravel application:

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'baseUrl' => rtrim(config('app.url'), '/'),
    ]);
}
```

### Basic Usage

```typescript
import { route, routeUrl, buildRoute } from 'inertia-route-helper';
import { dashboard, profile } from '@/routes'; // Your Ziggy/Wayfinder routes

// Get the full route object with absolute URL
const dashboardRoute = route(dashboard());
console.log(dashboardRoute.url); // https://example.com/dashboard

// Get just the URL string
const profileUrl = routeUrl(profile({ id: 123 }));
console.log(profileUrl); // https://example.com/profile/123

// Build route with query parameters
const searchUrl = buildRoute('/search', {
  query: { q: 'inertia', page: 2 },
  fragment: 'results'
});
console.log(searchUrl); // https://example.com/search?q=inertia&page=2#results
```

---

## 📖 Usage

### Working with Ziggy Routes

```typescript
import { route, routeUrl } from 'inertia-route-helper';
import { users, posts } from '@/routes';

// Simple route
const usersUrl = routeUrl(users());
// https://example.com/users

// Route with parameters
const userUrl = routeUrl(users.show({ user: 42 }));
// https://example.com/users/42

// Complex route with parameters
const postUrl = routeUrl(posts.edit({ post: 10, comment: 5 }));
// https://example.com/posts/10/comments/5/edit
```

### Building Routes with Query Parameters

```typescript
import { buildRoute, makeRoute } from 'inertia-route-helper';

// Using buildRoute
const productsUrl = buildRoute('/products', {
  query: {
    category: 'electronics',
    sort: 'price',
    order: 'desc',
    page: 2
  }
});
// https://example.com/products?category=electronics&sort=price&order=desc&page=2

// With array parameters
const filtersUrl = buildRoute('/api/items', {
  query: {
    tags: ['featured', 'new', 'sale'],
    price: [10, 100]
  }
});
// https://example.com/api/items?tags[]=featured&tags[]=new&tags[]=sale&price[]=10&price[]=100

// Using makeRoute with RouteDefinition
const searchUrl = makeRoute({
  url: '/search',
  query: { q: 'inertia' },
  fragment: 'results'
});
// https://example.com/search?q=inertia#results
```

### Route Navigation & Validation

```typescript
import { isCurrentRoute, currentPath, currentUrl } from 'inertia-route-helper';

// Check if a route is active (for navigation highlighting)
const isActive = isCurrentRoute('/dashboard'); // Partial match
const isExactActive = isCurrentRoute('/dashboard', true); // Exact match

// Get current path
const path = currentPath();
console.log(path); // /dashboard/settings

// Get current full URL
const url = currentUrl();
console.log(url); // https://example.com/dashboard/settings
```

### Configuration

```typescript
import { configure } from 'inertia-route-helper';

// Configure the route helper
configure({
  baseUrl: 'https://custom-domain.com', // Override base URL
  trailingSlash: true, // Add trailing slashes to URLs
  validateRoutes: true // Enable route validation (future feature)
});
```

### Manual Base URL Management

```typescript
import { setBaseUrl, getBaseUrl } from 'inertia-route-helper';

// Manually set base URL (useful for testing or special cases)
setBaseUrl('https://staging.example.com');

// Get the current base URL
const base = getBaseUrl();
console.log(base); // https://staging.example.com
```

---

## 🎯 API Reference

### Core Functions

#### `route<T>(routeDefinition: T): T`
Wraps a route definition and adds the absolute URL.

```typescript
const userRoute = route(users.show({ id: 1 }));
```

#### `routeUrl<T>(routeDefinition: T): string`
Returns just the absolute URL string for a route.

```typescript
const url = routeUrl(dashboard());
```

#### `buildRoute(path: string, options?): string`
Build a complete URL with query parameters and fragment.

```typescript
const url = buildRoute('/search', {
  query: { q: 'hello' },
  fragment: 'top',
  absolute: true // default
});
```

#### `makeRoute(definition: RouteDefinition): string`
Enhanced route builder with full feature support.

```typescript
const url = makeRoute({
  url: '/products',
  query: { category: 'books' },
  fragment: 'featured'
});
```

### Navigation Functions

#### `isCurrentRoute(path: string, exact?: boolean): boolean`
Check if a route matches the current path.

```typescript
const isActive = isCurrentRoute('/dashboard'); // Partial match
const isExact = isCurrentRoute('/dashboard', true); // Exact match
```

#### `currentPath(): string`
Get the current route path (relative).

```typescript
const path = currentPath(); // '/dashboard/profile'
```

#### `currentUrl(): string`
Get the current full URL.

```typescript
const url = currentUrl(); // 'https://example.com/dashboard/profile'
```

### Configuration Functions

#### `configure(options: RouteHelperConfig): void`
Configure the route helper behavior.

```typescript
configure({
  baseUrl: 'https://example.com',
  trailingSlash: true,
  validateRoutes: false
});
```

#### `setBaseUrl(url: string): void`
Manually set the base URL.

```typescript
setBaseUrl('https://api.example.com');
```

#### `getBaseUrl(): string`
Get the current base URL.

```typescript
const base = getBaseUrl();
```

---

## 💡 Examples

### React Example

```tsx
import { Link } from '@inertiajs/react';
import { routeUrl, isCurrentRoute } from 'inertia-route-helper';
import { dashboard, profile, settings } from '@/routes';

export function Navigation() {
  return (
    <nav>
      <Link 
        href={routeUrl(dashboard())}
        className={isCurrentRoute('/dashboard') ? 'active' : ''}
      >
        Dashboard
      </Link>
      
      <Link 
        href={routeUrl(profile({ id: userId }))}
        className={isCurrentRoute(`/profile/${userId}`, true) ? 'active' : ''}
      >
        Profile
      </Link>
      
      <Link href={routeUrl(settings())}>
        Settings
      </Link>
    </nav>
  );
}
```

### Vue Example

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { routeUrl, isCurrentRoute, buildRoute } from 'inertia-route-helper';
import { posts, search } from '@/routes';

const searchQuery = ref('');

const handleSearch = () => {
  const url = buildRoute('/search', {
    query: { q: searchQuery.value, type: 'posts' }
  });
  router.visit(url);
};
</script>

<template>
  <div>
    <Link 
      :href="routeUrl(posts())" 
      :class="{ active: isCurrentRoute('/posts') }"
    >
      All Posts
    </Link>
    
    <form @submit.prevent="handleSearch">
      <input v-model="searchQuery" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
  </div>
</template>
```

### Svelte Example

```svelte
<script lang="ts">
  import { router } from '@inertiajs/svelte';
  import { routeUrl, buildRoute, isCurrentRoute } from 'inertia-route-helper';
  import { products, categories } from '@/routes';
  
  let selectedCategory = 'all';
  
  function filterProducts(category: string) {
    const url = buildRoute('/products', {
      query: { category, sort: 'popular' }
    });
    router.visit(url);
  }
</script>

<nav>
  <a 
    href={routeUrl(products())} 
    class:active={isCurrentRoute('/products')}
  >
    Products
  </a>
  
  <button on:click={() => filterProducts('electronics')}>
    Electronics
  </button>
</nav>
```

---

## 🌐 Subfolder Deployments

This package is perfect for Laravel apps deployed in subfolders:

```php
// .env
APP_URL=https://example.com/my-app

// The package automatically handles this!
```

```typescript
import { routeUrl } from 'inertia-route-helper';
import { dashboard } from '@/routes';

const url = routeUrl(dashboard());
// Correctly returns: https://example.com/my-app/dashboard
// Not just: https://example.com/dashboard
```

---

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  RouteDefinition, 
  QueryParams, 
  RouteHelperConfig 
} from 'inertia-route-helper';

const route: RouteDefinition = {
  url: '/users',
  query: { page: 1, limit: 10 },
  fragment: 'list'
};

const query: QueryParams = {
  search: 'hello',
  filters: ['active', 'verified'],
  page: 1
};

const config: RouteHelperConfig = {
  baseUrl: 'https://example.com',
  trailingSlash: false
};
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT © [TUNBudi06](https://github.com/TUNBudi06)

---

## 🙏 Acknowledgments

- Built for [Inertia.js](https://inertiajs.com/) v2
- Works with [Ziggy](https://github.com/tighten/ziggy) and [Wayfinder](https://github.com/glhd/wayfinder)
- Inspired by the Laravel and Inertia.js communities

---

<div align="center">

**[⬆ back to top](#-inertia-route-helper)**

Made with ❤️ by [TUNBudi06](https://github.com/TUNBudi06)

</div>

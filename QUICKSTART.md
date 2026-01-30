# ðŸš€ Quick Start Guide - Inertia Route Helper

Get started with **inertia-route-helper** in just a few minutes!

---

## ðŸ“¦ Step 1: Install

```bash
npm install @tunbudi06/inertia-route-helper
```

---

## âš™ï¸ Step 2: Initialize in Your App

**Just pass `props` - the helper finds `initialPage.props.baseUrl` automatically:**

### Svelte

```typescript
// resources/js/app.ts
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/svelte';
import { hydrate, mount } from 'svelte';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper';

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob<ResolvedComponent>('./Pages/**/*.svelte');
        return pages[`./Pages/${name}.svelte`]();
    },
    setup({ el, App, props }) {
        // Just pass props - super simple!
        initRouteHelper(props);
        
        if (el && el.dataset.serverRendered === 'true') {
            hydrate(App, { target: el, props });
        } else if (el) {
            mount(App, { target: el, props });
        }
    },
});
```

### React

```typescript
// resources/js/app.tsx
import { createInertiaApp } from '@inertiajs/react';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper';

createInertiaApp({
    // ...existing code...
    setup({ el, App, props }) {
        initRouteHelper(props);
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});
```

### Vue 3

```typescript
// resources/js/app.ts
import { createInertiaApp } from '@inertiajs/vue3';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper';

createInertiaApp({
    // ...existing code...
    setup({ el, App, props }) {
        initRouteHelper(props);
        createApp({ render: () => h(App, props) }).mount(el);
    },
});
```

**That's it!** One line, super clean.

### Laravel Setup (Required)

**Share your base URL with Inertia:**

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'baseUrl' => rtrim(config('app.url'), '/'),
    ]);
}
```

This makes `baseUrl` available in `$page.props.baseUrl` for the initialization above.

---

## ðŸŽ¯ Step 3: Use the Helper Functions

### Import Functions

```typescript
import {
  route,
  routeUrl,
  buildRoute,
  makeRoute,
  isCurrentRoute,
  currentPath,
  currentUrl,
  configure
} from '@tunbudi06/inertia-route-helper';
```

### Core Functions

#### 1. `route()` - Transform Route Objects

```typescript
import { route } from '@tunbudi06/inertia-route-helper';
import { dashboard } from '@/routes';

const dashboardRoute = route(dashboard());
// { url: 'https://example.com/dashboard', ...otherProps }
```

#### 2. `routeUrl()` - Get URL String

```typescript
import { routeUrl } from '@tunbudi06/inertia-route-helper';
import { users } from '@/routes';

const url = routeUrl(users.show({ id: 123 }));
// 'https://example.com/users/123'
```

#### 3. `buildRoute()` - Build URLs with Query Params

```typescript
import { buildRoute } from '@tunbudi06/inertia-route-helper';

// Simple query params
const searchUrl = buildRoute('/search', {
  query: { q: 'test', page: 2 },
  fragment: 'results'
});
// 'https://example.com/search?q=test&page=2#results'

// Array parameters
const filtersUrl = buildRoute('/products', {
  query: { tags: ['new', 'featured'] }
});
// 'https://example.com/products?tags[]=new&tags[]=featured'

// Relative URL
const relativeUrl = buildRoute('/api/users', { absolute: false });
// '/api/users'
```

#### 4. `isCurrentRoute()` - Check Active Routes

```typescript
import { isCurrentRoute } from '@tunbudi06/inertia-route-helper';

// Use for navigation highlighting
const isActive = isCurrentRoute('/dashboard');
const isExact = isCurrentRoute('/dashboard', true);
```

#### 5. Navigation Helpers

```typescript
import { currentPath, currentUrl } from '@tunbudi06/inertia-route-helper';

const path = currentPath(); // '/dashboard/settings'
const url = currentUrl();   // 'https://example.com/dashboard/settings'
```

---

## ðŸ“ API Quick Reference

| Function | Purpose |
|----------|---------|
| `initRouteHelper(props)` | Initialize with Inertia props |
| `route(def)` | Get route with absolute URL |
| `routeUrl(def)` | Get URL string only |
| `buildRoute(path, opts)` | Build URL with query/fragment |
| `makeRoute(def)` | Build from object |
| `isCurrentRoute(path, exact?)` | Check if route is active |
| `currentPath()` | Get current pathname |
| `currentUrl()` | Get full current URL |
| `configure(opts)` | Global configuration |

---

## ðŸŽ¯ Step 4: Use in Your Components

### React/TypeScript

```tsx
import { Link } from '@inertiajs/react';
import { routeUrl, isCurrentRoute } from '@tunbudi06/inertia-route-helper';
import { dashboard, profile } from '@/routes';

export default function Navigation({ userId }: { userId: number }) {
  return (
    <nav>
      <Link 
        href={routeUrl(dashboard())}
        className={isCurrentRoute('/dashboard') ? 'active' : ''}
      >
        Dashboard
      </Link>
      
      <Link href={routeUrl(profile({ id: userId }))}>
        Profile
      </Link>
    </nav>
  );
}
```

### Vue 3

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { routeUrl, isCurrentRoute } from '@tunbudi06/inertia-route-helper';
import { dashboard, profile } from '@/routes';

const props = defineProps<{ userId: number }>();
</script>

<template>
  <nav>
    <Link 
      :href="routeUrl(dashboard())"
      :class="{ active: isCurrentRoute('/dashboard') }"
    >
      Dashboard
    </Link>
    
    <Link :href="routeUrl(profile({ id: userId }))">
      Profile
    </Link>
  </nav>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { routeUrl, isCurrentRoute } from '@tunbudi06/inertia-route-helper';
  import { dashboard, profile } from '$lib/routes';
  
  export let userId: number;
</script>

<nav>
  <a 
    href={routeUrl(dashboard())} 
    class:active={isCurrentRoute('/dashboard')}
  >
    Dashboard
  </a>
  
  <a href={routeUrl(profile({ id: userId }))}>
    Profile
  </a>
</nav>
```

---

## ðŸŽ¨ Common Use Cases

### Build Search URLs with Query Parameters

```typescript
import { buildRoute } from '@tunbudi06/inertia-route-helper';

const searchUrl = buildRoute('/search', {
  query: {
    q: 'inertia',
    category: 'tutorials',
    page: 2
  }
});
// Result: https://example.com/search?q=inertia&category=tutorials&page=2
```

### Highlight Active Navigation

```typescript
import { isCurrentRoute } from '@tunbudi06/inertia-route-helper';

// Partial match (matches /dashboard, /dashboard/settings, etc.)
const isDashboard = isCurrentRoute('/dashboard');

// Exact match (only /dashboard)
const isExactDashboard = isCurrentRoute('/dashboard', true);
```

### Handle Form Submissions

```typescript
import { router } from '@inertiajs/react';
import { routeUrl } from '@tunbudi06/inertia-route-helper';
import { posts } from '@/routes';

function handleSubmit(formData: FormData) {
  router.post(routeUrl(posts.store()), formData);
}
```

---

## ðŸŒ Subfolder Deployments

If your app is deployed in a subfolder, just set your `APP_URL`:

```env
# .env
APP_URL=https://example.com/my-app
```

The package automatically handles everything! All URLs will be prefixed correctly:

```typescript
routeUrl(dashboard())
// âœ… https://example.com/my-app/dashboard
```

---

## ðŸ”§ Advanced Configuration

```typescript
import { configure } from '@tunbudi06/inertia-route-helper';

// Optional: Configure global behavior
configure({
  baseUrl: 'https://custom-domain.com',  // Override base URL
  trailingSlash: true,                    // Add trailing slashes
  validateRoutes: false                   // Future feature
});
```

---

## ðŸ“š Need More Help?

- ðŸ“– **Full Documentation**: Check the [README.md](./README.md)
- ðŸ’¡ **Examples**: See [examples/](./examples/) for complete examples
- ðŸ› **Issues**: Report bugs on [GitHub Issues](https://github.com/TUNBudi06/inertia-route-helper/issues)
- ðŸ’¬ **Questions**: Ask on [GitHub Discussions](https://github.com/TUNBudi06/inertia-route-helper/discussions)

---

## âœ… You're Ready!

That's it! You're now ready to use **inertia-route-helper** in your project.

Happy coding! ðŸŽ‰



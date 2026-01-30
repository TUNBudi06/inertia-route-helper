# 🚀 Quick Start Guide - Inertia Route Helper

Get started with **inertia-route-helper** in just a few minutes!

---

## 📦 Step 1: Install

```bash
npm install inertia-route-helper
```

---

## ⚙️ Step 2: Laravel Setup

Add to your `HandleInertiaRequests` middleware:

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'baseUrl' => rtrim(config('app.url'), '/'),
    ]);
}
```

---

## 🎯 Step 3: Use in Your Components

### React/TypeScript

```tsx
import { Link } from '@inertiajs/react';
import { routeUrl, isCurrentRoute } from 'inertia-route-helper';
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
import { routeUrl, isCurrentRoute } from 'inertia-route-helper';
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
  import { routeUrl, isCurrentRoute } from 'inertia-route-helper';
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

## 🎨 Common Use Cases

### Build Search URLs with Query Parameters

```typescript
import { buildRoute } from 'inertia-route-helper';

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
import { isCurrentRoute } from 'inertia-route-helper';

// Partial match (matches /dashboard, /dashboard/settings, etc.)
const isDashboard = isCurrentRoute('/dashboard');

// Exact match (only /dashboard)
const isExactDashboard = isCurrentRoute('/dashboard', true);
```

### Handle Form Submissions

```typescript
import { router } from '@inertiajs/react';
import { routeUrl } from 'inertia-route-helper';
import { posts } from '@/routes';

function handleSubmit(formData: FormData) {
  router.post(routeUrl(posts.store()), formData);
}
```

---

## 🌐 Subfolder Deployments

If your app is deployed in a subfolder, just set your `APP_URL`:

```env
# .env
APP_URL=https://example.com/my-app
```

The package automatically handles everything! All URLs will be prefixed correctly:

```typescript
routeUrl(dashboard())
// ✅ https://example.com/my-app/dashboard
```

---

## 🔧 Advanced Configuration

```typescript
import { configure } from 'inertia-route-helper';

// Optional: Configure global behavior
configure({
  baseUrl: 'https://custom-domain.com',  // Override base URL
  trailingSlash: true,                    // Add trailing slashes
  validateRoutes: false                   // Future feature
});
```

---

## 📚 Need More Help?

- 📖 **Full Documentation**: Check the [README.md](./README.md)
- 💡 **Examples**: See [examples/](./examples/) for complete examples
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/TUNBudi06/inertia-route-helper/issues)
- 💬 **Questions**: Ask on [GitHub Discussions](https://github.com/TUNBudi06/inertia-route-helper/discussions)

---

## ✅ You're Ready!

That's it! You're now ready to use **inertia-route-helper** in your project.

Happy coding! 🎉

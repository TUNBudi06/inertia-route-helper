# Quick Reference Guide - v2.0.0

## 🚀 Quick Start

### 1. Install
```bash
npm install @tunbudi06/inertia-route-helper
```

### 2. Setup (in app.tsx/app.ts)
```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);  // ← One line setup!
    // ...
  }
});
```

### 3. Use (in components)
```typescript
import { route, buildRoute } from '@tunbudi06/inertia-route-helper';

const url = route({ url: '/dashboard' }).url;
```

---

## 📦 Import Cheat Sheet

### `/init` - For Setup Files Only
```typescript
import { 
  initRouteHelper,  // Initialize with props
  configure,        // Configure options
  setBaseUrl,       // Set base URL manually
  getBaseUrl,       // Get current base URL
  getConfig         // Get current config
} from '@tunbudi06/inertia-route-helper/init';
```

### Main Import - For All Components
```typescript
import { 
  route,            // Transform route with base URL
  routeUrl,         // Get URL string
  buildRoute,       // Build with query params
  makeRoute,        // Build from definition
  isCurrentRoute,   // Check if route is active
  currentPath,      // Get current pathname
  currentUrl,       // Get current full URL
  assetUrl          // Build asset URLs
} from '@tunbudi06/inertia-route-helper';
```

---

## 🎯 Common Use Cases

### Setup Application
```typescript
// app.tsx
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

initRouteHelper(props);
```

### Basic Route
```typescript
import { route } from '@tunbudi06/inertia-route-helper';

const url = route({ url: '/users/123' }).url;
// → https://example.com/users/123
```

### Route with Query Parameters
```typescript
import { buildRoute } from '@tunbudi06/inertia-route-helper';

const url = buildRoute('/search', {
  query: { q: 'inertia', page: 2 }
});
// → https://example.com/search?q=inertia&page=2
```

### Active Navigation Item
```typescript
import { isCurrentRoute } from '@tunbudi06/inertia-route-helper';

<Link 
  href="/dashboard"
  className={isCurrentRoute('/dashboard') ? 'active' : ''}
>
  Dashboard
</Link>
```

### Asset URLs
```typescript
import { assetUrl } from '@tunbudi06/inertia-route-helper';

const logo = assetUrl('images/logo.png');
// → https://example.com/images/logo.png
```

---

## 📂 File Structure Reference

```
your-app/
├── resources/js/
│   ├── app.tsx                 ← import from '/init'
│   ├── Pages/
│   │   ├── Dashboard.tsx       ← import from main
│   │   ├── Profile.tsx         ← import from main
│   │   └── Settings.tsx        ← import from main
│   └── Components/
│       ├── Navigation.tsx      ← import from main
│       └── Sidebar.tsx         ← import from main
```

---

## ⚙️ Configuration Options

```typescript
import { configure } from '@tunbudi06/inertia-route-helper/init';

configure({
  baseUrl: 'https://example.com',  // Base URL for all routes
  trailingSlash: true,             // Add trailing slashes
  validateRoutes: true             // Enable validation (future)
});
```

---

## 🔍 Function Overview

| Function | Module | Use Case |
|----------|--------|----------|
| `initRouteHelper()` | `/init` | App setup - initialize with props |
| `configure()` | `/init` | App setup - configure options |
| `setBaseUrl()` | `/init` | Testing - set base URL manually |
| `route()` | Main | Transform route definition |
| `routeUrl()` | Main | Get URL string from route |
| `buildRoute()` | Main | Build URL with query params |
| `makeRoute()` | Main | Build from RouteDefinition |
| `isCurrentRoute()` | Main | Check if route is active |
| `currentPath()` | Main | Get current pathname |
| `currentUrl()` | Main | Get full current URL |
| `assetUrl()` | Main | Build asset URLs |

---

## 🎨 Framework Examples

### React
```typescript
// Setup
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';
createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    createRoot(el).render(<App {...props} />);
  }
});

// Component
import { route, isCurrentRoute } from '@tunbudi06/inertia-route-helper';
function Nav() {
  return <Link href={route({ url: '/dashboard' }).url}>Dashboard</Link>;
}
```

### Vue 3
```typescript
// Setup
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';
createInertiaApp({
  setup({ el, App, props, plugin }) {
    initRouteHelper(props);
    createApp({ render: () => h(App, props) }).use(plugin).mount(el);
  }
});

// Component
import { route } from '@tunbudi06/inertia-route-helper';
const url = route({ url: '/dashboard' }).url;
```

### Svelte
```typescript
// Setup
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';
createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    new App({ target: el, props });
  }
});

// Component
import { route } from '@tunbudi06/inertia-route-helper';
const url = route({ url: '/dashboard' }).url;
```

---

## 🐛 Troubleshooting

### "Cannot find module '/init'"
**Solution**: Make sure you're using v2.0.0 or higher
```bash
npm install @tunbudi06/inertia-route-helper@latest
```

### Wrong import in component
**Problem**:
```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper';  // ❌
```
**Solution**:
```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';  // ✅
```

### Wrong import in setup
**Problem**:
```typescript
import { route } from '@tunbudi06/inertia-route-helper/init';  // ❌
```
**Solution**:
```typescript
import { route } from '@tunbudi06/inertia-route-helper';  // ✅
```

---

## 📝 Laravel Backend Setup

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

## 📊 Bundle Sizes

- **Main export**: 1.33 KB (route functions)
- **Init export**: 650 bytes (setup functions)
- **Total**: ~2 KB

---

## 📚 Documentation

- `README.md` - Main documentation
- `ARCHITECTURE.md` - Architecture details
- `CHANGELOG.md` - Version history
- `API.md` - Complete API reference
- `examples/` - Framework examples

---

## ✨ Key Points to Remember

1. **Use `/init` only in setup files** (app.tsx, app.ts)
2. **Use main import in all components** (Dashboard.tsx, etc.)
3. **Initialize once** with `initRouteHelper(props)`
4. **Then use route functions** everywhere

---

**Version**: 2.0.0  
**Architecture**: One Function Per File  
**License**: MIT

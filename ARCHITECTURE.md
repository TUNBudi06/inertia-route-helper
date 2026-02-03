# Architecture Overview - Version 2.0.0

## 📁 One Function Per File Architecture

Version 2.0.0 introduces a modular architecture where each function lives in its own file for maximum readability and maintainability.

## 🏗️ Directory Structure

```
src/
├── functions/                  # Route helper functions (main export)
│   ├── route.ts               # Transform route with base URL
│   ├── routeUrl.ts            # Get URL string from route
│   ├── buildRoute.ts          # Build URL with query params
│   ├── buildQueryString.ts    # Build query string helper
│   ├── makeRoute.ts           # Build from RouteDefinition
│   ├── isCurrentRoute.ts      # Check active routes
│   ├── currentPath.ts         # Get current pathname
│   ├── currentUrl.ts          # Get current full URL
│   └── assetUrl.ts            # Build asset URLs
│
├── init-functions/            # Initialization functions (/init export)
│   ├── initRouteHelper.ts    # Initialize with Inertia props
│   └── configure.ts           # Configure global options
│
├── state.ts                   # Centralized state management
├── types.ts                   # TypeScript type definitions
├── index.ts                   # Main exports (route functions)
└── init.ts                    # Init exports (setup functions)
```

## 📦 Import Structure

### Main Export (`index.ts`)
Used in components for route helper functions:

```typescript
import { 
  route, 
  routeUrl, 
  buildRoute, 
  makeRoute,
  isCurrentRoute,
  currentPath,
  currentUrl,
  assetUrl 
} from '@tunbudi06/inertia-route-helper';
```

### Init Export (`init.ts`)
Used in setup files for initialization and configuration:

```typescript
import { 
  initRouteHelper, 
  configure, 
  setBaseUrl, 
  getBaseUrl, 
  getConfig 
} from '@tunbudi06/inertia-route-helper/init';
```

## 🎯 Benefits of This Architecture

### 1. **Maximum Readability**
- Each function in its own file
- Easy to find and understand specific functionality
- Clear file naming conventions

### 2. **Better Maintainability**
- Single Responsibility Principle
- Changes to one function don't affect others
- Easier to test individual functions

### 3. **Clear Separation of Concerns**
- Route helper functions in `functions/`
- Initialization functions in `init-functions/`
- State management centralized in `state.ts`

### 4. **Better Code Organization**
- Functions grouped by purpose in directories
- Clearer project structure
- Easier for new developers to navigate

### 5. **Improved Developer Experience**
- Easy to locate specific function implementations
- Clear import paths
- Better IDE navigation

## 📊 File Breakdown

### Route Helper Functions (`functions/`)

| File | Function | Purpose |
|------|----------|---------|
| `route.ts` | `route()` | Transform route definition with absolute URL |
| `routeUrl.ts` | `routeUrl()` | Get just the URL string from route |
| `buildRoute.ts` | `buildRoute()` | Build complete URL with query params and fragment |
| `buildQueryString.ts` | `buildQueryString()` | Helper to build query strings (internal) |
| `makeRoute.ts` | `makeRoute()` | Build route from RouteDefinition object |
| `isCurrentRoute.ts` | `isCurrentRoute()` | Check if path matches current location |
| `currentPath.ts` | `currentPath()` | Get current pathname from browser |
| `currentUrl.ts` | `currentUrl()` | Get complete current URL |
| `assetUrl.ts` | `assetUrl()` | Build asset URLs with normalization |

### Initialization Functions (`init-functions/`)

| File | Function | Purpose |
|------|----------|---------|
| `initRouteHelper.ts` | `initRouteHelper()` | Initialize with Inertia props |
| `configure.ts` | `configure()` | Configure global options |

### Core Files

| File | Purpose |
|------|---------|
| `state.ts` | Centralized state management (baseUrl, config) |
| `types.ts` | TypeScript type definitions |
| `index.ts` | Main exports (re-exports from functions/) |
| `init.ts` | Init exports (re-exports from init-functions/) |

## 🔄 How It Works

### 1. State Management (`state.ts`)
Centralized state for baseUrl and configuration:
- `getBaseUrl()` - Get current base URL
- `setBaseUrl()` - Set base URL
- `getConfig()` - Get current configuration
- `setConfig()` - Update configuration

### 2. Function Files
Each function file:
- Imports dependencies (state, types, other functions)
- Implements a single function
- Exports that function
- Contains complete JSDoc documentation

### 3. Export Files
- `index.ts` - Re-exports all route helper functions
- `init.ts` - Re-exports all initialization functions

## 📝 Example Function File

```typescript
// src/functions/route.ts
import type { AnyRoute } from '../types';
import { getBaseUrl, getConfig } from '../state';

/**
 * Transform a route definition to include absolute URL
 * @param routeDefinition - Route object with url property
 * @returns Route object with absolute URL
 */
export function route<T extends AnyRoute>(routeDefinition: T): T {
  const base = getBaseUrl() || window.location.origin;
  const cfg = getConfig();

  let url = base + routeDefinition.url;

  if (cfg.trailingSlash && !url.endsWith('/')) {
    url += '/';
  }

  return { ...routeDefinition, url };
}
```

## 🧪 Testing

Tests import from the appropriate module:
- Route function tests: Import from `./index`
- Setup function tests: Import from `./init`

```typescript
// In component tests
import { route, buildRoute } from './index';
import { configure, setBaseUrl } from './init';
```

## 🎨 Code Style Guidelines

### File Naming
- Use camelCase for function names: `buildRoute.ts`
- One function per file with matching name
- Helper functions can be in same file

### Import Order
1. Type imports
2. State imports
3. Function imports
4. Helper imports

### Documentation
- Every function has complete JSDoc
- Include @param and @returns
- Provide usage examples

## 🚀 Usage Examples

### Setup (app.tsx)
```typescript
import { createInertiaApp } from '@inertiajs/react';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    // ...
  }
});
```

### Usage (Dashboard.tsx)
```typescript
import { route, buildRoute, isCurrentRoute } from '@tunbudi06/inertia-route-helper';

export default function Dashboard() {
  const profileUrl = route({ url: '/profile' }).url;
  const searchUrl = buildRoute('/search', { query: { q: 'test' } });
  const isActive = isCurrentRoute('/dashboard');
  
  return (/* ... */);
}
```

## 📈 Build Output

```
dist/
├── index.js          1.33 KB  (main export)
├── init.js           650 bytes (init export)
├── index.d.ts        4.79 KB  (types)
└── init.d.ts         1.56 KB  (init types)
```

## ✅ Test Results

- **Test Files**: 2 passed
- **Tests**: 65 passed
- **Coverage**: 100%

## 🎯 Migration from v1.x

### Before (v1.x)
```typescript
import { 
  configure, 
  initRouteHelper, 
  route, 
  buildRoute 
} from '@tunbudi06/inertia-route-helper';
```

### After (v2.x)
```typescript
// Setup file
import { configure, initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

// Component file
import { route, buildRoute } from '@tunbudi06/inertia-route-helper';
```

## 📚 Documentation Files

- `README.md` - Main documentation
- `CHANGELOG.md` - Version history
- `ARCHITECTURE.md` - This file
- `API.md` - Complete API reference
- `examples/` - Framework-specific examples

## 🔮 Future Improvements

Potential enhancements:
- More helper functions
- Additional route validation features
- Enhanced TypeScript types
- Performance optimizations

---

**Version**: 2.0.0  
**Architecture**: One Function Per File  
**Bundle Size**: ~2KB total  
**Test Coverage**: 100%

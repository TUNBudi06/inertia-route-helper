# Examples

This directory contains example usage of `@tunbudi06/inertia-route-helper` with different frameworks.

## Setup Examples (v2.0+)

**New in v2.0:** Initialization functions are imported from `/init` for better tree shaking.

- `react-setup.tsx` - Complete React + Inertia.js setup
- `vue-setup.ts` - Complete Vue 3 + Inertia.js setup
- `svelte-setup.ts` - Complete Svelte + Inertia.js setup

## Usage Examples

- `react-example.tsx` - React components using route helper
- `vue-example.vue` - Vue 3 components using route helper
- `svelte-example.svelte` - Svelte components using route helper

## Quick Start

### 1. Install the Package

```bash
npm install @tunbudi06/inertia-route-helper
```

### 2. Initialize in Your App Setup

**React:**
```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    // ...
  }
});
```

**Vue:**
```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
  setup({ el, App, props, plugin }) {
    initRouteHelper(props);
    // ...
  }
});
```

**Svelte:**
```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    // ...
  }
});
```

### 3. Use in Components

```typescript
import { route, buildRoute, isCurrentRoute } from '@tunbudi06/inertia-route-helper';

// Use the route helper functions in your components
const dashboardUrl = route({ url: '/dashboard' }).url;
```

## Laravel Setup

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'baseUrl' => rtrim(config('app.url'), '/'),
    ]);
}
```

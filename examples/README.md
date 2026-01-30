# Examples

This directory contains example usage of `inertia-route-helper` with different frameworks.

## React Example

See `react-example.tsx` for usage with React and TypeScript.

## Vue Example

See `vue-example.vue` for usage with Vue 3 Composition API.

## Svelte Example

See `svelte-example.svelte` for usage with Svelte.

## Running Examples

These are code examples only. To use them in your project:

1. Install the package: `npm install inertia-route-helper`
2. Set up your Laravel backend to share `baseUrl`
3. Import and use the functions in your components

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

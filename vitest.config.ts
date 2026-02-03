import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'examples/',
        'vitest.config.ts',
        'tsup.config.ts',
      ],
    },
    include: ['test/**/*.{test,spec}.ts'],
  },
});

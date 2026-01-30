import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: 'terser',
  treeshake: true,
  splitting: false,
  terserOptions: {
    compress: {
      passes: 3,
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      unsafe_math: true,
      unsafe_methods: true,
      drop_console: true,
    },
    mangle: {
      properties: {
        regex: /^_/,
      },
    },
    format: {
      comments: false,
    },
  },
});

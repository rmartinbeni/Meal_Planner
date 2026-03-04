import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    sequence: {
      shuffle: {
        files: true,
        tests: true,
      },
    },
  },
});

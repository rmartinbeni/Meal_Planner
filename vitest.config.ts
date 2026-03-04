import { defineConfig } from 'vitest/config';

// Node.js v25 introduced native Web Storage (--localstorage-file).
// Without a valid path it emits warnings in every worker thread.
// Disabling it via NODE_OPTIONS keeps the output clean.
process.env['NODE_OPTIONS'] = [process.env['NODE_OPTIONS'] ?? '', '--no-webstorage']
  .filter(Boolean)
  .join(' ');

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

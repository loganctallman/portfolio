import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 85,
        branches: 78,
        // Angular's build system emits many generated factory functions that
        // are never invoked in unit tests; 45% reflects real authored logic.
        functions: 45,
        lines: 87,
      },
    },
  },
});

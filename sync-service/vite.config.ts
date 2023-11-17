import path from 'path';
import {defineConfig} from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // Add any custom rules if necessary
  },
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
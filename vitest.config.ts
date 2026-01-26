// In vite.config.ts OR vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'; // <--- Import the plugin

export default defineConfig({
    plugins: [
        tsconfigPaths() // <--- Add the plugin here
    ],
    test: {
        // ... your other test config
    },
});

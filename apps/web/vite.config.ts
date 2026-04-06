import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    resolve: {
        tsconfigPaths: true,
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'import',
                    'color-functions',
                    'global-builtin',
                    'if-function',
                ],
            },
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return undefined;
                    }

                    if (id.includes('@sentry')) {
                        return 'sentry';
                    }

                    if (
                        id.includes('react') ||
                        id.includes('redux') ||
                        id.includes('history')
                    ) {
                        return 'react-vendor';
                    }

                    return 'vendor';
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./config/testSetup.ts'],
    },
});

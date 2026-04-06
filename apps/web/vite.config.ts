import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const srcRoot = path.resolve(__dirname, './src');

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@tiles-town/contracts': path.resolve(
                __dirname,
                '../../packages/contracts/src/index.ts',
            ),
            components: path.resolve(srcRoot, 'components'),
            constants: path.resolve(srcRoot, 'constants'),
            fonts: path.resolve(srcRoot, 'fonts'),
            store: path.resolve(srcRoot, 'store'),
            styles: path.resolve(srcRoot, 'styles'),
            typings: path.resolve(srcRoot, 'typings'),
            utils: path.resolve(srcRoot, 'utils'),
        },
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
        host: '127.0.0.1',
        port: 3200,
        proxy: {
            '/api': 'http://127.0.0.1:4200',
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

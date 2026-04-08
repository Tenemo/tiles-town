import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const srcRoot = path.resolve(__dirname, './src');
const webHost = process.env.WEB_HOST ?? '127.0.0.1';
const webPort = Number(process.env.WEB_PORT ?? '3200');
const apiProxyTarget =
    process.env.VITE_PROXY_API_TARGET ?? 'http://127.0.0.1:4200';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@tiles-town/contracts': path.resolve(
                __dirname,
                '../../packages/contracts/src/index.ts',
            ),
            '@tiles-town/game-core': path.resolve(
                __dirname,
                '../../packages/game-core/src/index.ts',
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
        host: webHost,
        port: webPort,
        proxy: {
            '/api': apiProxyTarget,
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

                    if (id.includes('react-router')) {
                        return 'router-vendor';
                    }

                    if (
                        id.includes('@reduxjs/toolkit') ||
                        id.includes('react-redux')
                    ) {
                        return 'state-vendor';
                    }

                    if (id.includes('react-dom') || id.includes('/react/')) {
                        return 'react-core';
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

import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            config: path.resolve(__dirname, 'src/config.ts'),
            constants: path.resolve(__dirname, 'src/constants'),
            controllers: path.resolve(__dirname, 'src/controllers'),
            database: path.resolve(__dirname, 'src/database.ts'),
            logging: path.resolve(__dirname, 'src/logging.ts'),
            models: path.resolve(__dirname, 'src/models'),
            routes: path.resolve(__dirname, 'src/routes'),
            utils: path.resolve(__dirname, 'src/utils'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.test.ts', 'src/**/*.spec.ts'],
        setupFiles: ['test/setup.ts'],
        hookTimeout: 30_000,
        testTimeout: 30_000,
    },
});

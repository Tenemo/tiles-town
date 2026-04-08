import { defineConfig, devices } from '@playwright/test';

const webPort = process.env.PLAYWRIGHT_WEB_PORT ?? '3200';
const webBaseUrl = `http://127.0.0.1:${webPort}`;
const shouldReuseExistingServer =
    process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === 'false'
        ? false
        : !process.env.CI;

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 120_000,
    expect: {
        timeout: 15_000,
    },
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    workers: process.env.CI ? 1 : undefined,
    use: {
        baseURL: webBaseUrl,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
    webServer: [
        {
            command: 'pnpm run docker:up',
            url: 'http://127.0.0.1:4200/api/health-check',
            reuseExistingServer: shouldReuseExistingServer,
            timeout: 120_000,
        },
        {
            command:
                'pnpm --filter @tiles-town/contracts run build && pnpm --filter @tiles-town/web run dev',
            env: {
                ...process.env,
                WEB_HOST: '127.0.0.1',
                WEB_PORT: webPort,
                VITE_PROXY_API_TARGET: 'http://127.0.0.1:4200',
            },
            url: webBaseUrl,
            reuseExistingServer: shouldReuseExistingServer,
            timeout: 120_000,
        },
    ],
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 120_000,
    expect: {
        timeout: 15_000,
    },
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: 'http://127.0.0.1:3200',
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
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
        {
            command: 'pnpm --filter @tiles-town/contracts run build && pnpm --filter @tiles-town/web run dev',
            url: 'http://127.0.0.1:3200',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
    ],
});

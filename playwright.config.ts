import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;
const MOCK = 4399;

export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  snapshotPathTemplate: '{testDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' } },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /(visual|privacy)\.spec\.ts$/ },
  ],
  webServer: [
    {
      command: `node tests/support/mock-server.ts ${MOCK}`,
      port: MOCK,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node scripts/serve.ts ${PORT}`,
      port: PORT,
      reuseExistingServer: !process.env.CI,
      env: {
        TURNSTILE_SECRET: 'test-secret',
        TURNSTILE_VERIFY_URL: `http://localhost:${MOCK}/turnstile`,
        N8N_WEBHOOK_URL: `http://localhost:${MOCK}/hook`,
        N8N_WEBHOOK_SECRET: 'test-webhook-secret',
      },
    },
  ],
});

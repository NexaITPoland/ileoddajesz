import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e', timeout: 45_000, fullyParallel: true, reporter: [['list']],
  use: { baseURL: 'http://localhost:4400', launchOptions: { executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] } },
  webServer: { command: 'node scripts/serve-dist.mjs 4400', port: 4400, reuseExistingServer: true },
});

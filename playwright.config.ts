import { defineConfig } from '@playwright/test';
import fs from 'node:fs';

const cachedChromiumPath =
  '/Users/sebi/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off',
    launchOptions: fs.existsSync(cachedChromiumPath)
      ? { executablePath: cachedChromiumPath }
      : undefined,
  },
  webServer: {
    command: 'npm run dev -- -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30000,
  },
});

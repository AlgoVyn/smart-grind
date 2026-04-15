import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';

const IS_CI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  
  // Conservative timeouts for stability
  timeout: 60000,
  expect: { timeout: 10000 },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Workers - conservative for stability
  workers: IS_CI ? 2 : Math.min(2, os.cpus().length),
  
  // Retry failed tests
  retries: IS_CI ? 2 : 1,
  
  // Reporter
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  
  use: {
    baseURL: 'http://localhost:3001/smartgrind/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
    viewport: { width: 1280, height: 720 },
    contextOptions: {
      reducedMotion: 'reduce',
      permissions: ['clipboard-read', 'clipboard-write'],
    },
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-gpu', '--no-sandbox'],
        },
      },
    },
  ],
  
  webServer: {
    command: 'npm run dev -- --port 3001',
    url: 'http://localhost:3001/smartgrind/',
    reuseExistingServer: true,
    timeout: 60000,
  },
  
  globalTimeout: 300000, // 5 minutes max for entire run
});

const { defineConfig } = require('@playwright/test');
const dotenv = require('dotenv');
dotenv.config();

module.exports = defineConfig({
  timeout: 60000,
  retries: 1,
  testDir: './tests',
  outputDir: 'reports/screenshots',
  grep: process.env.TEST_TAG ? new RegExp(process.env.TEST_TAG, 'i') : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8000',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.spec\.js/
    }
  ],
  globalSetup: require.resolve('./global-setup.js')
});

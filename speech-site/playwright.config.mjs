import {defineConfig, devices} from '@playwright/test';

const baseURL=process.env.PORTAL_ORIGIN || 'http://127.0.0.1:4340';
export default defineConfig({
  testDir:'./tests/browser',
  timeout:30000,
  fullyParallel:false,
  workers:2,
  retries:0,
  reporter:[['list'],['html',{outputFolder:'audits/playwright-report',open:'never'}]],
  outputDir:'audits/playwright-results',
  use:{baseURL,trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[
    {name:'phone-320',use:{browserName:'chromium',viewport:{width:320,height:568}}},
    {name:'phone-390',use:{...devices['Pixel 7'],viewport:{width:390,height:844}}},
    {name:'tablet-768',use:{browserName:'chromium',viewport:{width:768,height:1024}}},
    {name:'desktop-1440',use:{browserName:'chromium',viewport:{width:1440,height:900}}},
    {name:'firefox',use:{...devices['Desktop Firefox']}},
    {name:'webkit',use:{...devices['iPhone 13']}},
    {name:'edge',use:{...devices['Desktop Edge'],channel:'msedge'}}
  ],
  webServer:process.env.PORTAL_ORIGIN ? undefined : {
    command:'node scripts/serve-quality-preview.mjs',
    url:baseURL,
    reuseExistingServer:false,
    timeout:30000
  }
});

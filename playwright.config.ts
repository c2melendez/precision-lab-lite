import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const baseURL = `http://127.0.0.1:${port}/precision-lab-lite/`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 7_500 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], browserName: "chromium", viewport: { width: 1440, height: 900 } } },
    { name: "tablet-chromium", use: { browserName: "chromium", viewport: { width: 1024, height: 768 }, hasTouch: true } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"], browserName: "chromium" } },
  ],
  webServer: {
    // M16: los E2E certifican el artefacto de producción, no el servidor
    // de desarrollo con HMR. En CI se observó un reload asíncrono de Vite
    // dev después de un cálculo válido (el historial ya contenía 120),
    // generando flakiness artificial en Productoria/Sumatoria Desktop.
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});

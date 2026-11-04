import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  timeout: 30_000,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    ...devices["Desktop Chrome"],
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
        (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 5173 --strictPort",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});

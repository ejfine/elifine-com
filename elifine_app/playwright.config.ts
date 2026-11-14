import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import { deployedBaseUrl, ensureLocalServerPort } from "./tests/e2e/target";

const e2eDir = fileURLToPath(new URL("./tests/e2e", import.meta.url));

// A static site has no backend to boot, so instead of globalSetup/globalTeardown the suite either targets an
// already-deployed site (VRT_BASE_URL) or lets Playwright's webServer serve the generated .output/public on a
// randomly-chosen port. The port is resolved here, in the main process — worker processes inherit the env and
// re-read the same value.
async function resolveTarget(): Promise<{ baseURL: string; webServer?: { command: string; url: string } }> {
  if (deployedBaseUrl !== undefined) {
    return { baseURL: deployedBaseUrl };
  }
  const port = await ensureLocalServerPort();
  const baseURL = `http://127.0.0.1:${port}`;
  return { baseURL, webServer: { command: `pnpm serve-static --port ${port}`, url: baseURL } };
}

const { baseURL, webServer } = await resolveTarget();

export default defineConfig({
  testDir: e2eDir,
  // The {platform} token means a baseline recorded on linux CI will not silently match a developer's
  // macOS run — font hinting/antialiasing differ per OS, so a mismatch is surfaced rather than hidden.
  // Regenerate per-platform with `--update-snapshots`.
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}-{platform}{ext}",
  fullyParallel: true, // static site, no shared state across specs
  forbidOnly: process.env.CI === "true",
  retries: process.env.CI === "true" ? 1 : 0,
  reporter: process.env.CI === "true" ? [["html", { open: "never" }], ["list"]] : [["list"]],
  webServer,
  use: {
    baseURL,
    // View a failure's trace.zip (which will be generated in the `test-results` folder) with:
    //   pnpm exec playwright show-trace --host 0.0.0.0 --port <any-open-port> <path/to/trace.zip>
    // The --host/--port flags are required in the devcontainer so the viewer is reachable via a
    // forwarded port (the default `show-trace` launches a local browser and errors out with no display).
    trace: "retain-on-failure",
    // motion-v (JS-driven) animations ignore `animations: "disabled"` below; the app honors
    // prefers-reduced-motion so content renders in its final state for screenshots.
    reducedMotion: "reduce",
  },
  expect: {
    toHaveScreenshot: {
      // disable CSS animations/transitions and hide the text caret so neither introduces per-run noise
      animations: "disabled",
      caret: "hide",
      // tolerate sub-pixel antialiasing differences without masking real regressions
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

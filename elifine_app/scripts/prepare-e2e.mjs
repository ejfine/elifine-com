import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// A Node script rather than shell conditionals in package.json, so the E2E scripts also work under Windows' cmd.
const rootDir = fileURLToPath(new URL("..", import.meta.url));
const useShell = process.platform === "win32";

// Locally the suite tests a fresh build of the current source. CI downloads the build artifact instead, and a run
// against a deployed site (VRT_BASE_URL or E2E_STACK_OUTPUTS_FILE) never serves the local build at all.
const shouldGenerateSite = () => {
  if (process.env.CI === "true") {
    return false;
  }
  if (process.env.VRT_BASE_URL) {
    return false;
  }
  if (process.env.E2E_STACK_OUTPUTS_FILE) {
    return false;
  }
  return true;
};

if (shouldGenerateSite()) {
  execFileSync("pnpm", ["exec", "nuxt", "generate"], {
    cwd: rootDir,
    env: process.env,
    shell: useShell,
    stdio: "inherit",
  });
}

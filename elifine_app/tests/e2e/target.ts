import { readFileSync } from "node:fs";
import { createServer } from "node:net";

// E2E/VRT runs either against the locally served static build (default) or against an already-deployed site:
// - E2E_STACK_OUTPUTS_FILE: the JSON from the deploy's `--outputs --json`. The suite targets the stack's app-url, and
//   globalSetup waits for the deploy's CloudFront invalidation before any test runs (the post-deploy CI step).
// - VRT_BASE_URL: any URL, overriding the stack's app-url. On its own it needs no AWS access, and nothing waits for
//   an invalidation, e.g. for a quick check of production from a developer machine.
const LOCAL_PORT_ENV = "E2E_STATIC_SERVER_PORT";

function readStackOutputs(): Map<string, unknown> | undefined {
  const outputsFile = process.env.E2E_STACK_OUTPUTS_FILE;
  if (!outputsFile) {
    return undefined;
  }
  return new Map<string, unknown>(Object.entries(JSON.parse(readFileSync(outputsFile, "utf8"))));
}

export const stackOutputs = readStackOutputs();

export function stackOutput({ outputs, name }: { outputs: Map<string, unknown>; name: string }): string {
  const value = outputs.get(name);
  if (typeof value !== "string") {
    throw new Error(`Stack output "${name}" must be a string, but was ${JSON.stringify(value)}`);
  }
  return value;
}

function resolveDeployedBaseUrl(): string | undefined {
  const override = process.env.VRT_BASE_URL;
  if (override) {
    return override;
  }
  if (stackOutputs === undefined) {
    return undefined;
  }
  return stackOutput({ outputs: stackOutputs, name: "app-url" });
}

export const deployedBaseUrl = resolveDeployedBaseUrl();

function getRandomOpenPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        server.close();
        reject(new Error("Failed to get port number"));
        return;
      }
      const { port } = address;
      server.close(() => {
        resolve(port);
      });
    });
  });
}

// playwright.config.ts is evaluated in the main process and again in every worker. The main process picks
// the port and stashes it in the environment, which workers inherit, so every process agrees on one port.
export async function ensureLocalServerPort(): Promise<number> {
  const existing = process.env[LOCAL_PORT_ENV];
  if (existing !== undefined) {
    return Number(existing);
  }
  const port = await getRandomOpenPort();
  process.env[LOCAL_PORT_ENV] = port.toString();
  return port;
}

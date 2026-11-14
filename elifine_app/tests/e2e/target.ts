import { createServer } from "node:net";

// E2E/VRT runs either against the locally served static build (default) or against an already-deployed
// site when VRT_BASE_URL is set (e.g. https://www.elifine.com in the post-deploy CI job).
const LOCAL_PORT_ENV = "E2E_STATIC_SERVER_PORT";

export const deployedBaseUrl = process.env.VRT_BASE_URL;

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

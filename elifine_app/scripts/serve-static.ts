// Serves the generated static site with the same path rules as the production S3 website endpoint, so
// E2E/VRT runs locally and in CI see the same responses as https://www.elifine.com.
//
// Why not `pnpm preview` (nuxt preview)? It always runs the node-server preset entry
// (.output/server/index.mjs), which a static `nuxt generate` build doesn't produce, so it fails to start.
import { createServer } from "node:http";
import path from "node:path";
import { parseArgs } from "node:util";
import handler from "serve-handler";

const { values } = parseArgs({ options: { port: { type: "string" } } });
if (values.port === undefined) {
  throw new Error("--port is required");
}
const publicDir = path.resolve(".output/public");

createServer((request, response) => {
  handler(request, response, {
    public: publicDir,
    // serve-handler only maps `dir/` to `dir/index.html` when cleanUrls is on (with it off, every page route
    // 404s). Side effect: explicit `*.html` URLs redirect to their extensionless form, which this site never links to.
    cleanUrls: true,
    // Like S3's index_document handling: `/about` redirects to `/about/`. serve-handler always uses 301 where
    // S3 uses 302, and it also redirects missing extensionless paths before 404ing (S3 404s directly), so
    // tests assert "redirects to the slash URL" / "ends in 404" rather than exact status chains.
    trailingSlash: true,
    // S3 website endpoints never list directories; a directory without index.html is a 404 there too.
    directoryListing: false,
    // Missing paths get the root 404.html with status 404, matching S3's error_document (serve-handler does this
    // by default; nothing to configure).
  }).catch((error: unknown) => {
    console.error(error);
    if (!response.headersSent) {
      response.writeHead(500);
    }
    response.end();
  });
}).listen(Number(values.port), "127.0.0.1", () => {
  console.log(`Serving ${publicDir} at http://127.0.0.1:${values.port}`);
});

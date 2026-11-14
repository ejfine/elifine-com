import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { type APIRequestContext, expect, test } from "@playwright/test";
import { StatusCodes } from "http-status-codes";
import { deployedBaseUrl } from "../target";

const INDEX_FILE_NAME = "index.html";

const expectedStaticAssetsDir = process.env.EXPECTED_STATIC_ASSETS_DIR;

type Mismatch = { urlPath: string; expectedSha256: string; actualStatus: number; actualSha256: string };

function sha256(content: Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

async function listFilesRelativeTo({ dir }: { dir: string }): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)));
}

// The S3 website endpoint serves a directory's index.html at the directory URL as well, and that's the URL
// visitors actually use, so both are checked.
function urlPathsFor({ relativeFilePath }: { relativeFilePath: string }): string[] {
  const urlPath = `/${relativeFilePath.split(path.sep).map(encodeURIComponent).join("/")}`;
  if (path.basename(relativeFilePath) === INDEX_FILE_NAME) {
    return [urlPath, urlPath.slice(0, -INDEX_FILE_NAME.length)];
  }
  return [urlPath];
}

async function findMismatch({
  request,
  urlPath,
  expectedSha256,
}: {
  request: APIRequestContext;
  urlPath: string;
  expectedSha256: string;
}): Promise<Mismatch | undefined> {
  const response = await request.get(urlPath, { maxRedirects: 0 });
  const actualSha256 = sha256(await response.body());
  if (response.status() === StatusCodes.OK && actualSha256 === expectedSha256) {
    return undefined;
  }
  return { urlPath, expectedSha256, actualStatus: response.status(), actualSha256 };
}

test("Given a deployed site and the build artifact it was deployed from, When requesting every artifact file from the site, Then each response matches the artifact byte for byte", async ({
  request,
}) => {
  if (deployedBaseUrl === undefined || expectedStaticAssetsDir === undefined) {
    test.skip(
      true,
      "Set VRT_BASE_URL and EXPECTED_STATIC_ASSETS_DIR to compare a deployed site with its build artifact",
    );
    return;
  }
  const relativeFilePaths = await listFilesRelativeTo({ dir: expectedStaticAssetsDir });

  const mismatches = await Promise.all(
    relativeFilePaths.flatMap((relativeFilePath) =>
      urlPathsFor({ relativeFilePath }).map(async (urlPath) =>
        findMismatch({
          request,
          urlPath,
          expectedSha256: sha256(await readFile(path.join(expectedStaticAssetsDir, relativeFilePath))),
        }),
      ),
    ),
  );

  expect(relativeFilePaths).not.toEqual([]);
  expect(mismatches.filter((mismatch) => mismatch !== undefined)).toEqual([]);
});

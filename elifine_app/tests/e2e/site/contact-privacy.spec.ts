import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { deployedBaseUrl } from "../target";
import { CONTACT_EMAIL, SCHEDULER_LINK } from "./contact-details";
import { PAGE_ROUTES } from "./routes";

const FORBIDDEN_IN_PAGE_SOURCE = [CONTACT_EMAIL, SCHEDULER_LINK];

const localBuildDir = fileURLToPath(new URL("../../../.output/public", import.meta.url));

function builtSiteDir(): string | undefined {
  if (deployedBaseUrl === undefined) {
    return localBuildDir;
  }
  return process.env.EXPECTED_STATIC_ASSETS_DIR;
}

test.describe("When fetching the raw HTML of a page", () => {
  for (const route of PAGE_ROUTES) {
    test(`Then ${route} does not contain contact details in its source`, async ({ request }) => {
      const response = await request.get(route);

      const html = (await response.text()).toLowerCase();

      expect(response.ok()).toBe(true);
      expect(FORBIDDEN_IN_PAGE_SOURCE.filter((contactDetail) => html.includes(contactDetail))).toEqual([]);
    });
  }
});

test("When reading every file of the built site, Then none contains contact details", async () => {
  const dir = builtSiteDir();
  if (dir === undefined) {
    test.skip(true, "Set EXPECTED_STATIC_ASSETS_DIR to scan the build artifact of a deployed site");
    return;
  }
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const filePaths = entries.filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name));

  const leaks = await Promise.all(
    filePaths.map(async (filePath) => {
      const content = (await readFile(filePath, "latin1")).toLowerCase();
      return FORBIDDEN_IN_PAGE_SOURCE.filter((contactDetail) => content.includes(contactDetail)).map(
        (contactDetail) => `${path.relative(dir, filePath)}: ${contactDetail}`,
      );
    }),
  );

  expect(filePaths).not.toEqual([]);
  expect(leaks.flat()).toEqual([]);
});

import { expect, test } from "@playwright/test";
import { PAGE_ROUTES } from "./routes";

// The email address and scheduling link are assembled client-side so scrapers reading the raw HTML
// (including the serialized Nuxt payload) never see them. They're assembled from parts here too, so this
// public test file doesn't hand scrapers the same strings it protects the site from leaking.
const emailUser = "e.j.fine";
const emailDomain = "gmail";
const schedulerHost = "calendly";
const schedulerUser = "eli-fine";
const FORBIDDEN_IN_PAGE_SOURCE = [`${emailUser}@${emailDomain}.com`, `${schedulerHost}.com/${schedulerUser}`];

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

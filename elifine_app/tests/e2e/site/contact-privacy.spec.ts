import { expect, test } from "@playwright/test";
import { CONTACT_EMAIL, SCHEDULER_LINK } from "./contact-details";
import { PAGE_ROUTES } from "./routes";

const FORBIDDEN_IN_PAGE_SOURCE = [CONTACT_EMAIL, SCHEDULER_LINK];

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

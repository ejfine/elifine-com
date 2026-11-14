import { expect, test } from "@playwright/test";
import { CONTACT_EMAIL } from "./contact-details";

test("When visiting the contact page, Then the email address is shown as a mailto link", async ({ page }) => {
  await page.goto("/contact/");

  await expect(page.locator(`a[href="mailto:${CONTACT_EMAIL}"]`)).toHaveText(CONTACT_EMAIL);
});

import { expect, test } from "@playwright/test";
import { StatusCodes } from "http-status-codes";
import { CONTACT_EMAIL, SCHEDULER_URL } from "./contact-details";

test.describe("When visiting the contact page", () => {
  test("Then the email address is shown as a mailto link", async ({ page }) => {
    await page.goto("/contact/");

    await expect(page.locator(`a[href="mailto:${CONTACT_EMAIL}"]`)).toHaveText(CONTACT_EMAIL);
  });

  test("Then the scheduling link opens a live scheduler page in a new tab", async ({ page, request }) => {
    await page.goto("/contact/");
    const schedulerLink = page.locator(`a[href="${SCHEDULER_URL}"]`);
    // TODO: move the new-tab check to an ObfuscatedLink unit test once the repo has a unit test harness
    await expect(schedulerLink).toHaveAttribute("target", "_blank");

    const response = await request.get(SCHEDULER_URL);

    expect(response.status()).toBe(StatusCodes.OK);
  });

  test("Then copying the email address puts it on the clipboard and confirms with a toast", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/contact/");

    await page.getByRole("button", { name: `Copy ${CONTACT_EMAIL}` }).click();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardText).toBe(CONTACT_EMAIL);
    await expect(
      page
        .getByRole("region", { name: /notifications/i })
        .getByRole("listitem")
        .filter({ hasText: CONTACT_EMAIL }),
    ).toBeVisible();
  });
});

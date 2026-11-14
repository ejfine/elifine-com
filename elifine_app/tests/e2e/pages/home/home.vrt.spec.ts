import { vrtTest } from "../../fixtures";
import { waitForPageSettled } from "../../helpers/page-settled";
import { expectFullPageScreenshot } from "../../helpers/vrt";

vrtTest("When visiting the home page, Then it matches the light and dark baselines", async ({ page }) => {
  await page.goto("/");
  await waitForPageSettled({ page });

  await expectFullPageScreenshot(page, "home-page.png");
});

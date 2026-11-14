import type { Page } from "@playwright/test";

// Screenshots taken before the page settles pick up fallback fonts, blank lazy images, or pre-hydration
// markup, and those differ from run to run. Wait for all three before taking one.
export async function waitForPageSettled({ page }: { page: Page }): Promise<void> {
  // Vue sets __vue_app__ on the mount element and Nuxt exposes its app as the $nuxt global property, whose
  // isHydrating flag flips to false once hydration finishes. Neither is typed on the DOM element, hence the
  // runtime key checks.
  await page.waitForFunction(() => {
    function hasKey<K extends string>(value: unknown, key: K): value is Record<K, unknown> {
      return typeof value === "object" && value !== null && key in value;
    }
    const appRoot = document.querySelector("#__nuxt");
    if (!hasKey(appRoot, "__vue_app__") || !hasKey(appRoot.__vue_app__, "config")) {
      return false;
    }
    const { config } = appRoot.__vue_app__;
    if (!hasKey(config, "globalProperties") || !hasKey(config.globalProperties, "$nuxt")) {
      return false;
    }
    const nuxtApp = config.globalProperties.$nuxt;
    return hasKey(nuxtApp, "isHydrating") && nuxtApp.isHydrating === false;
  });
  await page.evaluate(() => document.fonts.ready);
  // Lazy images only start loading once scrolled near the viewport, so scroll to the bottom to trigger them
  // all, then back to the top so the screenshot starts from the same position every time.
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
  );
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}

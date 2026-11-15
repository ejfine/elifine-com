import { createPage, setup, url } from "@nuxt/test-utils/e2e";
import { describe, expect, test } from "vitest";

describe("Home page", async () => {
  await setup();
  test("When loading the home page, Then it hydrates and renders its heading", async () => {
    expect.assertions(1);
    const page = await createPage();

    await page.goto(url("/"), { waitUntil: "hydration" });

    const heading = await page.locator("main h1").textContent();

    expect(heading?.trim()).not.toBe("");
  });
});

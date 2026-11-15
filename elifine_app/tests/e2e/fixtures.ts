import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

// Mirrors tests/setup/faker.ts (used by the vitest unit/compiled projects). Seed once per worker so a
// failing run can be reproduced with TEST_FAKER_SEED=<logged value>. Playwright runs files in a stable
// order (no vitest-style shuffle), so seed + order reproduce the sequence.
const parsedSeed = Number(process.env.TEST_FAKER_SEED);
const fakerSeed = Number.isNaN(parsedSeed) ? Math.floor(Math.random() * 1e9) : parsedSeed;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- `void` is Playwright's idiom for a worker fixture that provides no value (auto-run side effect only)
export const test = base.extend<object, { seedFaker: void }>({
  seedFaker: [
    // eslint-disable-next-line no-empty-pattern -- Playwright requires the first fixture arg to be object-destructured; `{}` is the zero-dependency form
    async ({}, use) => {
      console.log("[seed passed to faker]", fakerSeed);
      faker.seed(fakerSeed);
      await use();
    },
    { scope: "worker", auto: true },
  ],
});

// Use this in anything calling toHaveScreenshot. It auto-skips on Windows, where we have no easy way to
// record platform-matching baselines. Behavioral specs keep using `test` so they still run on Windows. The
// skip is wired as an auto-fixture (rather than `vrtTest.skip()` inside a beforeEach) so the running test's
// TestInfo is threaded in explicitly — the static `test.skip(cond, msg)` form was a no-op for tests defined
// on an extended test instance.
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- `void` is Playwright's idiom for an auto-run fixture that provides no value
export const vrtTest = test.extend<{ skipOnWindows: void }>({
  skipOnWindows: [
    // eslint-disable-next-line no-empty-pattern -- Playwright requires the first fixture arg to be object-destructured; `{}` is the zero-dependency form
    async ({}, use, testInfo) => {
      testInfo.skip(process.platform === "win32", "VRT baselines are generated on Linux only");
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";

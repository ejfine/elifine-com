import vitest from "@vitest/eslint-plugin";
import withNuxt from "./.nuxt/eslint.config.mjs";
export default withNuxt(
  {
    // Disallow <script lang="js"> in Vue files
    files: ["**/*.vue"],
    rules: {
      "vue/block-lang": [
        "error",
        {
          script: {
            lang: "ts",
          },
        },
      ],
      "vue/html-self-closing": ["error", { html: { void: "always" } }], // match prettier, which always writes void elements as <br />; the rule's default ("never") autofixes them to <br >, and the two formatters then fight
    },
  },
  {
    // Disallow .js files in favor of typescript
    files: ["**/*.js"],
    ignores: [
      // add exceptions here if you must allow certain .js files
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message: "Use .ts instead of .js.",
        },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.ts"],
    plugins: {
      vitest,
    },
    rules: {
      ...Object.fromEntries(
        // @vitest/eslint-plugin's configs.all sets every rule to "warn"; promote them to "error" (preserving the
        // plugin's intentional "off" defaults) so violations fail lint. Done programmatically so rules added in future
        // plugin versions are promoted too, rather than silently arriving as warnings.
        Object.entries(vitest.configs.all.rules).map(([rule, severity]) =>
          severity === "off" ? [rule, "off"] : [rule, "error"],
        ),
      ),
      "vitest/max-expects": ["error", { max: 10 }], // 5 is too low. There are legitimate reasons to have several assertions (especially with DOM tests) that share the same Arrange/Act
      "vitest/unbound-method": "off", // requires typed linting (parserOptions.project), not configured in this project
      "vitest/require-mock-type-parameters": "off", // stylistic; vi.fn() inferred type is sufficient and explicit generics add noise on trivial mocks
      "vitest/prefer-describe-function-title": "off", // autofix rewrites string titles to identifier references, which then conflicts with vitest/valid-title for default-imported functions
      "vitest/padding-around-all": "off", // project test style keeps blank lines minimal (see AGENTS.md); these rules pad every block boundary
      "vitest/padding-around-after-all-blocks": "off",
      "vitest/padding-around-after-each-blocks": "off",
      "vitest/padding-around-before-all-blocks": "off",
      "vitest/padding-around-before-each-blocks": "off",
      "vitest/padding-around-describe-blocks": "off",
      "vitest/padding-around-expect-groups": "off",
      "vitest/padding-around-test-blocks": "off",
      "vitest/no-focused-tests": ["error", { fixable: false }], // automatically fixing this could confuse the user
      "vitest/consistent-test-filename": ["error", { pattern: ".*\\.spec\\.ts$" }],
      "vitest/prefer-lowercase-title": "off", // no reason to force lowercase titles
      "vitest/consistent-test-it": "off", // consistency for this is overrated, let the dev choose what's most readable based on the test title
      "vitest/prefer-to-be-falsy": "off", // sometimes you want to check explicitly for false and not just falsy
      "vitest/prefer-to-be-truthy": "off", // sometimes you want to check explicitly for true and not just truthy
    },
  },
  {
    // E2E specs run under the @playwright/test runner, not vitest. The broad **/*.{test,spec}.ts block above
    // still attaches the vitest plugin, so disable the rules that misfire on Playwright specs.
    files: ["tests/e2e/**/*.spec.ts"],
    rules: {
      "vitest/prefer-expect-assertions": "off", // Playwright's web-first matchers; vitest's expect.assertions() counter can't track them
      "vitest/prefer-importing-vitest-globals": "off", // test/expect come from Playwright; autofix would inject a conflicting vitest import
      "vitest/require-hook": "off", // top-level setup (e.g. generating one test per route) is normal in Playwright specs
    },
  },
);

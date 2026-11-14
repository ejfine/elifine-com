import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { StatusCodes } from "http-status-codes";
import { deployedBaseUrl } from "../target";
import { BARE_DOMAIN_HOST, PRODUCTION_HOST } from "./routes";

test.describe("Given the suite is running against production", () => {
  test.skip(
    deployedBaseUrl === undefined || new URL(deployedBaseUrl).host !== PRODUCTION_HOST,
    "CloudFront redirects only exist on the deployed site",
  );

  test("When requesting the bare domain with a path and query, Then it permanently redirects to the same path and query on www", async ({
    request,
  }) => {
    const query = `q=${faker.string.alphanumeric(8)}`;

    const response = await request.get(`https://${BARE_DOMAIN_HOST}/about/?${query}`, { maxRedirects: 0 });

    expect(response.status()).toBe(StatusCodes.MOVED_PERMANENTLY);
    expect(response.headers().location).toBe(`https://${PRODUCTION_HOST}/about/?${query}`);
  });

  test("When requesting www over plain HTTP, Then it permanently redirects to HTTPS", async ({ request }) => {
    const response = await request.get(`http://${PRODUCTION_HOST}/about/`, { maxRedirects: 0 });

    expect(response.status()).toBe(StatusCodes.MOVED_PERMANENTLY);
    expect(response.headers().location).toBe(`https://${PRODUCTION_HOST}/about/`);
  });
});

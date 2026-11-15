import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { StatusCodes } from "http-status-codes";

test.describe("When requesting a page route without its trailing slash", () => {
  test("Then it redirects to the trailing-slash URL", async ({ request }) => {
    const response = await request.get("/about", { maxRedirects: 0 });

    const location = response.headers().location;

    // S3 website endpoints answer 302; the local serve-handler stand-in can only answer 301. Either is a correct redirect.
    expect([StatusCodes.MOVED_PERMANENTLY, StatusCodes.MOVED_TEMPORARILY]).toContain(response.status());
    expect(new URL(location ?? "", response.url()).pathname).toBe("/about/");
  });
});

test.describe("When requesting a route that does not exist", () => {
  test("Then it responds 404 with an HTML error page", async ({ request }) => {
    const response = await request.get(`/${faker.string.uuid()}`);

    expect(response.status()).toBe(StatusCodes.NOT_FOUND);
    expect(response.headers()["content-type"]).toContain("text/html");
  });
});

test.describe("When requesting a static asset", () => {
  test("Then the resume PDF is served as a PDF", async ({ request }) => {
    const response = await request.get("/resume-eli-fine.pdf");

    expect(response.status()).toBe(StatusCodes.OK);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });

  test("Then robots.txt is served as plain text", async ({ request }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(StatusCodes.OK);
    expect(response.headers()["content-type"]).toContain("text/plain");
  });

  test("Then the favicon is served", async ({ request }) => {
    const response = await request.get("/favicon.ico");

    expect(response.status()).toBe(StatusCodes.OK);
  });
});

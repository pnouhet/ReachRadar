import { expect, test } from "@playwright/test";

const BANNER = "We use cookies";

test("the banner shows on first visit; Reject all hides it for good", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const banner = page.getByRole("region", { name: BANNER });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Reject all" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("region", { name: BANNER })).toHaveCount(0);
  const cookie = (await context.cookies()).find((c) => c.name === "rr_consent");
  expect(cookie?.value).toBe("v1.0.0");
});

test("Accept all stores v1.1.1", async ({ page, context }) => {
  await page.goto("/");
  await page
    .getByRole("region", { name: BANNER })
    .getByRole("button", { name: "Accept all" })
    .click();
  await expect(page.getByRole("region", { name: BANNER })).toBeHidden();
  expect(
    (await context.cookies()).find((c) => c.name === "rr_consent")?.value,
  ).toBe("v1.1.1");
});

test("a malformed cookie counts as no choice", async ({ page, context }) => {
  await context.addCookies([
    { name: "rr_consent", value: "garbage", url: "http://localhost:3000" },
  ]);
  await page.goto("/");
  await expect(page.getByRole("region", { name: BANNER })).toBeVisible();
});

test("a valid cookie keeps the banner away", async ({ page, context }) => {
  await context.addCookies([
    { name: "rr_consent", value: "v1.1.0", url: "http://localhost:3000" },
  ]);
  await page.goto("/");
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("region", { name: BANNER })).toHaveCount(0);
});

test("the banner shows on the login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("region", { name: BANNER })).toBeVisible();
});

test("Customize heads to the preferences section of the cookie policy", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("region", { name: BANNER })
    .getByRole("link", { name: "Customize" })
    .click();
  await expect(page).toHaveURL(/\/legal\/cookies#preferences$/);
  await expect(page.locator("section#preferences")).toBeVisible();
  await expect(
    page
      .locator("section#preferences")
      .getByRole("switch", { name: "Analytics" }),
  ).toBeVisible();
});

test("the banner does not overflow at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("region", { name: BANNER })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

test("saving on the cookie page hides the banner", async ({
  page,
  context,
}) => {
  await page.goto("/legal/cookies#preferences");
  await expect(page.getByRole("region", { name: BANNER })).toBeVisible();
  await page.getByRole("switch", { name: "Analytics" }).click();
  await page.getByRole("button", { name: "Save my choices" }).click();
  await expect(page.getByRole("region", { name: BANNER })).toBeHidden();
  expect(
    (await context.cookies()).find((c) => c.name === "rr_consent")?.value,
  ).toBe("v1.1.0");
});

test("on a phone the banner never covers the Log in button", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/login");
  const banner = page.getByRole("region", { name: BANNER });
  await expect(banner).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const button = page.getByRole("button", { name: "Log in", exact: true });
  await button.scrollIntoViewIfNeeded();
  const b = await button.boundingBox();
  const r = await banner.boundingBox();
  expect(b!.y + b!.height).toBeLessThanOrEqual(r!.y + 1);
  await button.click({ timeout: 3000 });
  await expect(page).toHaveURL(/\/login/);
});

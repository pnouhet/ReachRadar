import { expect, test } from "@playwright/test";
import { logIn } from "../helpers/e2e";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "../helpers/users";

let artist: TestUser;
let curator: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({
    role: "artist",
    displayName: "E2E Pricing Artist",
  });
  curator = await createTestUser({
    role: "curator",
    displayName: "E2E Pricing Curator",
  });
});
test.afterAll(async () => {
  for (const u of [artist, curator]) if (u) await deleteTestUser(u.id);
});

// These tests are about the page, not the cookie banner that would cover its lower part.
test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "rr_consent", value: "v1.0.0", url: "http://localhost:3000" },
  ]);
});

test("the page title is Buy credits", async ({ page }) => {
  await page.goto("/pricing");
  await expect(
    page.getByRole("heading", { level: 1, name: "Buy credits" }),
  ).toBeVisible();
});

test("four packs with their prices, the Artist one marked most popular", async ({
  page,
}) => {
  await page.goto("/pricing");
  const cards = page.locator("main article");
  await expect(cards).toHaveCount(4);
  const expected = [
    ["Starter", "€12"],
    ["Artist", "€32"],
    ["Pro", "€76"],
    ["Label", "€192"],
  ];
  for (const [i, [name, price]] of expected.entries()) {
    await expect(cards.nth(i).getByRole("heading", { level: 3 })).toHaveText(
      name,
    );
    await expect(cards.nth(i)).toContainText(price);
  }
  await expect(page.getByText("Most popular")).toHaveCount(1);
  await expect(cards.nth(1).getByText("Most popular")).toBeVisible();
});

test("a guest's buy button goes to sign up", async ({ page }) => {
  await page.goto("/pricing");
  await expect(
    page.getByRole("link", { name: "Buy 30 credits" }),
  ).toHaveAttribute("href", "/signup");
});

test("an artist's buy button goes to credits", async ({ page }) => {
  await logIn(page, artist, "/login?next=/pricing");
  await page.goto("/pricing");
  await expect(
    page.getByRole("link", { name: "Buy 30 credits" }),
  ).toHaveAttribute("href", "/credits");
});

test("a curator's buy button goes to the dashboard", async ({ page }) => {
  await logIn(page, curator, "/login?next=/pricing");
  await page.goto("/pricing");
  await expect(
    page.getByRole("link", { name: "Buy 30 credits" }),
  ).toHaveAttribute("href", "/dashboard");
});

test("the FAQ opens one answer at a time", async ({ page }) => {
  await page.goto("/pricing");
  const first = page.getByRole("button", { name: "Do credits expire?" });
  const second = page.getByRole("button", {
    name: "What if a curator doesn't answer?",
  });
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await second.click();
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "false");
});

test("the earn band and support links lead to the right pages", async ({
  page,
}) => {
  await page.goto("/pricing");
  await expect(
    page.getByRole("link", { name: "Start rating songs" }),
  ).toHaveAttribute("href", "/rate");
  await expect(
    page.getByRole("link", { name: "Contact support" }),
  ).toHaveAttribute("href", "/legal/legal-notice#contact");
});

test("no horizontal overflow on a phone, cards stacked", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/pricing");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  const xs = await page
    .locator("main article")
    .evaluateAll((els) =>
      els.map((e) => Math.round(e.getBoundingClientRect().x)),
    );
  expect(new Set(xs).size).toBe(1);
});

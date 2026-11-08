import { expect, test, type Page } from "@playwright/test";
import { logIn } from "../helpers/e2e";
import {
  createTestUser,
  deleteTestUser,
  grantAdmin,
  type TestUser,
} from "../helpers/users";

let admin: TestUser;
let artist: TestUser;

test.beforeAll(async () => {
  admin = await createTestUser({ role: "artist", displayName: "E2E Admin" });
  await grantAdmin(admin.email);
  artist = await createTestUser({ role: "artist", displayName: "E2E Regular" });
});
test.afterAll(async () => {
  for (const u of [admin, artist]) if (u) await deleteTestUser(u.id);
});

const strip = (page: Page) => page.getByRole("region", { name: "Admin" });
const nav = (page: Page) => page.getByRole("navigation", { name: "Main" });

test("an admin sees the strip and the artist side first", async ({ page }) => {
  await logIn(page, admin);
  await expect(strip(page)).toContainText("Viewing as artist");
  await expect(
    nav(page).getByRole("link", { name: /Pitch to curators/ }),
  ).toBeVisible();
  await expect(nav(page).getByRole("link", { name: /Inbox/ })).toHaveCount(0);
});

test("switching flips the sidebar and stays on shared pages", async ({
  page,
}) => {
  await logIn(page, admin, "/login?next=/messages");
  await strip(page).getByRole("button", { name: "Switch to curator" }).click();
  await expect(strip(page)).toContainText("Viewing as curator");
  await expect(page).toHaveURL(/\/messages$/);
  await expect(nav(page).getByRole("link", { name: /Inbox/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Withdraw" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Buy credits" })).toHaveCount(0);
  // Back to artist for the next tests.
  await strip(page).getByRole("button", { name: "Switch to artist" }).click();
  await expect(strip(page)).toContainText("Viewing as artist");
});

test("switching from an artist-only page lands on the dashboard", async ({
  page,
}) => {
  await logIn(page, admin, "/login?next=/pitch");
  await expect(page).toHaveURL(/\/pitch$/);
  await strip(page).getByRole("button", { name: "Switch to curator" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(strip(page)).toContainText("Viewing as curator");
});

test("a deep link to the other side flips the view", async ({ page }) => {
  await logIn(page, admin);
  await page.goto("/pitch");
  await expect(strip(page)).toContainText("Viewing as artist");
  await page.goto("/inbox");
  await expect(page).toHaveURL(/\/inbox$/);
  await expect(strip(page)).toContainText("Viewing as curator");
  await expect(nav(page).getByRole("link", { name: /Inbox/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("the view is remembered", async ({ page }) => {
  await logIn(page, admin);
  await page.goto("/inbox");
  await expect(strip(page)).toContainText("Viewing as curator");
  await page.reload();
  await expect(strip(page)).toContainText("Viewing as curator");
  await page.goto("/dashboard");
  await expect(strip(page)).toContainText("Viewing as curator");
});

test("an admin can open the upload page", async ({ page }) => {
  await logIn(page, admin, "/login?next=/profile/upload");
  await expect(page).toHaveURL(/\/profile\/upload$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Upload a track" }),
  ).toBeVisible();
  await expect(page.getByTestId("audio-input")).toBeAttached();
  await expect(strip(page)).toContainText("Viewing as artist");
});

test("the strip does not overflow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await logIn(page, admin);
  await expect(strip(page)).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(overflow).toBeLessThanOrEqual(375);
});

test("a regular artist sees no admin strip, even with a view cookie", async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([
    { name: "rr-view", value: "curator", url: baseURL! },
  ]);
  await logIn(page, artist);
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(strip(page)).toHaveCount(0);
  await expect(nav(page).getByRole("link", { name: /Inbox/ })).toHaveCount(0);
});

test("the design system shows the admin strip to admins", async ({ page }) => {
  await logIn(page, admin);
  await strip(page).getByRole("link", { name: "Design system" }).click();
  await expect(page).toHaveURL(/\/design-system$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Design system" }),
  ).toBeVisible();
  await expect(strip(page)).toBeVisible();
});

test("going back to a page of the other side brings its sidebar back", async ({
  page,
}) => {
  await logIn(page, admin);
  await page.goto("/inbox");
  await expect(strip(page)).toContainText("Viewing as curator");
  await strip(page).getByRole("button", { name: "Switch to artist" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(strip(page)).toContainText("Viewing as artist");
  await page.goBack();
  await expect(page).toHaveURL(/\/inbox$/);
  await expect(strip(page)).toContainText("Viewing as curator");
  await expect(nav(page).getByRole("link", { name: /Inbox/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

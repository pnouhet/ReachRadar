import { expect, test } from "@playwright/test";
import { logIn } from "../helpers/e2e";
import { createTestUser, deleteTestUser, grantAdmin, type TestUser } from "../helpers/users";

// Run against a deployment only: BASE_URL=https://reachradar.vercel.app npx playwright test prod-smoke
test.skip(!process.env.BASE_URL, "Set BASE_URL to smoke-test a deployment.");

let artist: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({ role: "artist", displayName: "Prod Smoke" });
});
test.afterAll(async () => {
  if (artist) await deleteTestUser(artist.id);
});

test("the home page answers", async ({ request }) => {
  const res = await request.get("/");
  expect(res.status()).toBe(200);
});

test("app pages require a login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
});

test("the design-system page is hidden in production", async ({ request }) => {
  const res = await request.get("/design-system");
  expect(res.status()).toBe(404);
});

test("an artist can log in and open their profile", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await logIn(page, artist, "/login?next=/profile");
  await expect(page.getByRole("heading", { level: 1, name: "Prod Smoke" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Tracks (0)" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("an admin can open the design system in production", async ({ page }) => {
  const admin = await createTestUser({ role: "artist", displayName: "Prod Admin" });
  try {
    await grantAdmin(admin.email);
    await logIn(page, admin);
    await page.goto("/design-system");
    await expect(page.getByRole("heading", { level: 1, name: "Design system" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Admin" })).toBeVisible();
  } finally {
    await deleteTestUser(admin.id);
  }
});

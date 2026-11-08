import { expect, test, type Page } from "@playwright/test";
import { createTestUser, deleteTestUser, type TestUser } from "../helpers/users";

let artist: TestUser;
let curator: TestUser;
let unconfirmed: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({ role: "artist", displayName: "E2E Artist" });
  curator = await createTestUser({ role: "curator", displayName: "E2E Curator", curatorType: "playlist" });
  unconfirmed = await createTestUser({ role: "artist", displayName: "E2E Unconfirmed", confirmed: false });
});

test.afterAll(async () => {
  for (const u of [artist, curator, unconfirmed]) if (u) await deleteTestUser(u.id);
});

async function logIn(page: Page, user: TestUser, path = "/login") {
  await page.goto(path);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Log in" }).click();
}

test("an artist logs in and lands on the dashboard with the artist sidebar", async ({ page }) => {
  await logIn(page, artist);
  await expect(page).toHaveURL(/\/dashboard$/);
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: /Pitch to curators/ })).toBeVisible();
  await expect(nav.getByRole("link", { name: /Inbox/ })).toHaveCount(0);
});

test("a curator gets the curator sidebar", async ({ page }) => {
  await logIn(page, curator);
  await expect(page).toHaveURL(/\/dashboard$/);
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: /Inbox/ })).toBeVisible();
  await expect(nav.getByRole("link", { name: /Rate & earn/ })).toHaveCount(0);
});

test("a wrong password shows a clear error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(artist.email);
  await page.getByLabel("Password", { exact: true }).fill("not-the-password-1");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Wrong email or password." })).toBeVisible();
});

test("an unconfirmed account is asked to confirm and can resend the email", async ({ page }) => {
  await logIn(page, unconfirmed);
  await expect(page.getByRole("alert").filter({ hasText: "Please confirm your email first." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resend email" })).toBeVisible();
});

test("an anonymous visitor is sent to login and comes back after logging in", async ({ page }) => {
  await page.goto("/settings/profile");
  await expect(page).toHaveURL(/\/login\?next=%2Fsettings%2Fprofile$/);
  await page.getByLabel("Email").fill(artist.email);
  await page.getByLabel("Password", { exact: true }).fill(artist.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/settings\/profile$/);
});

test("roles cannot open each other's pages", async ({ page }) => {
  await logIn(page, artist);
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/inbox");
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.context().clearCookies();
  await logIn(page, curator);
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/pitch");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("choosing the professional role card leads to the curator sign-up", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("radio", { name: /I'm a professional/ }).click();
  await page.getByRole("link", { name: "Continue as a professional" }).click();
  await expect(page).toHaveURL(/\/signup\/curator$/);
  await expect(page.getByRole("heading", { name: "Join as a pro" })).toBeVisible();
});

test("signed-in users are kept away from the login page", async ({ page }) => {
  await logIn(page, artist);
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/login");
  await expect(page).toHaveURL(/\/dashboard$/);
});

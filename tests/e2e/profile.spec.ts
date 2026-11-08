import { expect, test } from "@playwright/test";
import { logIn, makePng } from "../helpers/e2e";
import { createTestUser, deleteTestUser, type TestUser } from "../helpers/users";

let artist: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({ role: "artist", displayName: "Profile Tester" });
});
test.afterAll(async () => {
  if (artist) await deleteTestUser(artist.id);
});

test("a new artist without a photo sees initials", async ({ page }) => {
  await logIn(page, artist, "/login?next=/settings/profile");
  await expect(page).toHaveURL(/\/settings\/profile$/);
  await expect(page.getByRole("img", { name: "Profile Tester" }).first()).toContainText("PT");
});

test("an artist edits their profile and uploads a photo, and it persists", async ({ page }) => {
  await logIn(page, artist, "/login?next=/settings/profile");

  await page.getByLabel("Artist name").fill("Ilan Mercier Live");
  await page.getByLabel("Bio").fill("Paris-based producer and DJ.");
  await page.getByRole("button", { name: "Deep house" }).click();
  await page.getByRole("button", { name: "Melodic techno" }).click();
  await page.getByLabel("SoundCloud").fill("soundcloud.com/ilanmercier");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Profile updated" })).toBeVisible();

  const png = await makePng(page, 400, 400);
  await page.getByTestId("avatar-input").setInputFiles({ name: "me.png", mimeType: "image/png", buffer: png });
  await expect(page.getByRole("status").filter({ hasText: "Photo updated" })).toBeVisible({ timeout: 20_000 });

  await page.reload();
  await expect(page.getByLabel("Artist name")).toHaveValue("Ilan Mercier Live");
  await expect(page.getByLabel("Bio")).toHaveValue("Paris-based producer and DJ.");
  await expect(page.getByRole("button", { name: "Deep house" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("SoundCloud")).toHaveValue("https://soundcloud.com/ilanmercier");
  await expect(page.locator("header").getByRole("img", { name: "Ilan Mercier Live" })).toHaveAttribute("src", /avatars/);
});

test("the bio stops at 300 characters", async ({ page }) => {
  await logIn(page, artist, "/login?next=/settings/profile");
  await page.getByLabel("Bio").fill("x".repeat(320));
  await expect(page.getByLabel("Bio")).toHaveValue("x".repeat(300));
  await expect(page.getByText("300 / 300")).toBeVisible();
});

test("a too-small banner is refused with a clear message", async ({ page }) => {
  await logIn(page, artist, "/login?next=/settings/profile");
  const small = await makePng(page, 800, 200);
  await page.getByTestId("banner-input").setInputFiles({ name: "b.png", mimeType: "image/png", buffer: small });
  await expect(page.getByRole("alert").filter({ hasText: "Banner must be at least 1600 × 400 px." })).toBeVisible();
});

test("an invalid link keeps the edits and points at the field", async ({ page }) => {
  await logIn(page, artist, "/login?next=/settings/profile");
  await page.getByLabel("Bio").fill("Edited but not saved yet.");
  await page.getByLabel("YouTube").fill("notalink");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Paste a full web link.")).toBeVisible();
  await expect(page.getByLabel("Bio")).toHaveValue("Edited but not saved yet.");
  await expect(page.getByLabel("YouTube")).toHaveValue("notalink");
});

import { expect, test } from "@playwright/test";
import { logIn, makePng } from "../helpers/e2e";
import { createTestUser, deleteTestUser, type TestUser } from "../helpers/users";
import { makeWav } from "../helpers/wav";

let artist: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({ role: "artist", displayName: "Draft Tester" });
});
test.afterAll(async () => {
  if (artist) await deleteTestUser(artist.id);
});

test.describe.configure({ mode: "serial" });

test("a cancelled upload leaves no draft behind", async ({ page }) => {
  await logIn(page, artist, "/login?next=/profile/upload");
  // Hold the upload open so it can be cancelled mid-way.
  await page.route("**/storage/v1/upload/resumable**", () => undefined);
  await page.getByTestId("audio-input").setInputFiles({ name: "stuck.wav", mimeType: "audio/wav", buffer: Buffer.from(makeWav(2)) });
  await page.getByRole("button", { name: "Cancel upload" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Upload cancelled." })).toBeVisible();
  await page.unroute("**/storage/v1/upload/resumable**");

  await page.goto("/profile");
  await expect(page.getByRole("tab", { name: "Tracks (0)" })).toBeVisible();
});

test("saving a draft then publishing keeps every optional field", async ({ page }) => {
  await logIn(page, artist, "/login?next=/profile/upload");
  await page.getByTestId("audio-input").setInputFiles({ name: "keep.wav", mimeType: "audio/wav", buffer: Buffer.from(makeWav(2)) });
  await expect(page.getByText("Uploaded", { exact: true })).toBeVisible({ timeout: 30_000 });
  const cover = await makePng(page, 1000, 1000);
  await page.getByTestId("artwork-input").setInputFiles({ name: "cover.png", mimeType: "image/png", buffer: cover });
  await expect(page.getByRole("img", { name: "Artwork preview" })).toBeVisible({ timeout: 20_000 });

  await page.getByLabel("Title", { exact: true }).fill("Keep Everything");
  await page.getByLabel("Featured artists (optional)").fill("Nova");
  await page.getByLabel("Spotify or private link (optional)").fill("soundcloud.com/keep/private");
  await page.getByText("Explicit content").click();
  await page.getByRole("group", { name: "Release status" }).getByRole("button", { name: "Demo" }).click();
  await page.getByLabel("Primary genre").selectOption("Deep house");
  await page.getByLabel("Secondary genre (optional)").selectOption("Melodic techno");
  await page.getByLabel("BPM").fill("120");
  await page.getByLabel("Key (optional)").fill("A minor");
  await page.getByLabel("Vocals", { exact: true }).selectOption({ index: 1 });
  const vocals = await page.getByLabel("Vocals", { exact: true }).inputValue();
  await page.getByText("I own or control all rights").click();

  await page.getByRole("button", { name: "Save as draft" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Draft saved" })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByLabel("Featured artists (optional)")).toHaveValue("Nova");

  await page.getByRole("button", { name: "Publish track" }).click();
  await expect(page.getByRole("heading", { name: /Keep Everything is live/ })).toBeVisible({ timeout: 20_000 });

  await page.reload();
  await expect(page.getByLabel("Featured artists (optional)")).toHaveValue("Nova");
  await expect(page.getByLabel("Spotify or private link (optional)")).toHaveValue("https://soundcloud.com/keep/private");
  await expect(page.getByLabel("Explicit content")).toBeChecked();
  await expect(page.getByLabel("Secondary genre (optional)")).toHaveValue("Melodic techno");
  await expect(page.getByLabel("Key (optional)")).toHaveValue("A minor");
  await expect(page.getByLabel("Vocals", { exact: true })).toHaveValue(vocals);
});

test("an unfinished draft can be deleted from My profile", async ({ page }) => {
  await logIn(page, artist, "/login?next=/profile/upload");
  await page.getByTestId("audio-input").setInputFiles({ name: "temp.wav", mimeType: "audio/wav", buffer: Buffer.from(makeWav(1)) });
  await expect(page.getByText("Uploaded", { exact: true })).toBeVisible({ timeout: 30_000 });

  await page.goto("/profile");
  await expect(page.getByRole("tab", { name: "Tracks (2)" })).toBeVisible();
  await page.getByRole("button", { name: "Delete draft" }).click();
  await expect(page.getByRole("tab", { name: "Tracks (1)" })).toBeVisible();
});

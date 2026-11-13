import { expect, test } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { logIn, makePng } from "../helpers/e2e";
import { createTestUser, deleteTestUser, type TestUser } from "../helpers/users";
import { makeWav } from "../helpers/wav";

let artist: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({ role: "artist", displayName: "Upload Tester" });
});
test.afterAll(async () => {
  if (artist) await deleteTestUser(artist.id);
});

test("a new artist's profile shows only the upload card, with no errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await logIn(page, artist, "/login?next=/profile");
  await expect(page.getByRole("heading", { level: 1, name: "Upload Tester" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Upload Tester" }).first()).toContainText("UT");
  await expect(page.getByRole("tab", { name: "Tracks (0)" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Upload a new track/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("an artist uploads, publishes and plays a track", async ({ page }) => {
  await logIn(page, artist, "/login?next=/profile/upload");

  await page.getByTestId("audio-input").setInputFiles({ name: "afterlight.wav", mimeType: "audio/wav", buffer: Buffer.from(makeWav(10)) });
  await expect(page.getByText("Uploaded", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/WAV · 0\.\d MB · 0:10/)).toBeVisible();

  const cover = await makePng(page, 1000, 1000, "#e54166");
  await page.getByTestId("artwork-input").setInputFiles({ name: "cover.png", mimeType: "image/png", buffer: cover });
  await expect(page.getByRole("img", { name: "Artwork preview" })).toBeVisible({ timeout: 20_000 });

  await page.getByLabel("Title", { exact: true }).fill("Afterlight");
  await page.getByRole("group", { name: "Release status" }).getByRole("button", { name: "Upcoming" }).click();
  await page.getByLabel("Primary genre").selectOption("Melodic techno");
  await page.getByLabel("BPM").fill("124");
  await page.getByText("I own or control all rights").click();

  await expect(page.getByText("5 / 6")).toBeVisible();
  await page.getByRole("button", { name: "Publish track" }).click();
  await expect(page.getByRole("heading", { name: /Afterlight is live/ })).toBeVisible({ timeout: 20_000 });

  await page.goto("/profile");
  await expect(page.getByRole("tab", { name: "Tracks (1)" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Afterlight" })).toBeVisible();
  await expect(page.getByText("Melodic techno · 124 BPM · 0:10")).toBeVisible();

  await page.getByRole("button", { name: "Play Afterlight" }).click();
  await expect(page.getByRole("button", { name: "Pause Afterlight" })).toBeVisible({ timeout: 10_000 });
});

test("the player bar keeps playing from page to page, and closes", async ({ page }) => {
  await logIn(page, artist, "/login?next=/profile");
  await expect(page.getByRole("region", { name: "Audio player" })).toBeHidden();

  await page.getByRole("button", { name: "Play Afterlight" }).click();
  const bar = page.getByRole("region", { name: "Audio player" });
  const seek = bar.getByRole("slider", { name: "Seek" });
  const position = async () => Number(await seek.inputValue());
  await expect(bar.getByText("Afterlight", { exact: true })).toBeVisible();
  await expect(bar.getByText("Upload Tester")).toBeVisible();
  await expect(bar.getByRole("button", { name: "Pause", exact: true })).toBeVisible({ timeout: 10_000 });

  // The bar is pinned to the bottom edge and the page pads itself so nothing hides behind it.
  const box = (await bar.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(Math.round(box.y + box.height)).toBe(viewport.height);
  expect(Math.round(box.width)).toBe(viewport.width);
  expect(await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom))).toBeGreaterThanOrEqual(72);

  // Client navigation through the sidebar: same audio, still running.
  await page.getByRole("link", { name: "Messages" }).click();
  await page.waitForURL("**/messages");
  await expect(bar.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  const afterNavigation = await position();
  await expect.poll(position).toBeGreaterThan(afterNavigation);

  // Back on the profile, the card's button mirrors the bar.
  await page.getByRole("link", { name: "My profile" }).click();
  await page.waitForURL("**/profile");
  await expect(page.getByRole("button", { name: "Pause Afterlight" })).toBeVisible();
  await bar.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(bar.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play Afterlight" })).toBeVisible();

  // Seeking and volume answer to the keyboard.
  const paused = await position();
  await seek.focus();
  await page.keyboard.press("ArrowRight");
  expect(await position()).toBeGreaterThan(paused);
  const volume = bar.getByRole("slider", { name: "Volume" });
  await volume.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(volume).toHaveAttribute("aria-valuetext", "99%");

  await bar.getByRole("button", { name: "Close player" }).click();
  await expect(bar).toBeHidden();
  expect(await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom))).toBe(0);
});

test("an .ogg file is refused before any draft is created", async ({ page }) => {
  await logIn(page, artist, "/login?next=/profile/upload");
  await page.getByTestId("audio-input").setInputFiles({ name: "song.ogg", mimeType: "audio/ogg", buffer: Buffer.from("OggS") });
  await expect(page.getByRole("alert").filter({ hasText: "Use an MP3, FLAC or WAV file." })).toBeVisible();
  await page.goto("/profile");
  await expect(page.getByRole("tab", { name: "Tracks (1)" })).toBeVisible();
});

test("a file over 50 MB is refused without uploading anything", async ({ page }, testInfo) => {
  await logIn(page, artist, "/login?next=/profile/upload");
  const uploads: string[] = [];
  page.on("request", (r) => r.url().includes("/storage/v1/upload") && uploads.push(r.url()));
  const big = testInfo.outputPath("big.wav");
  writeFileSync(big, Buffer.alloc(51 * 1024 * 1024));
  await page.getByTestId("audio-input").setInputFiles(big);
  await expect(page.getByRole("alert").filter({ hasText: "File too large — max 50 MB. Export as MP3 or FLAC." })).toBeVisible();
  expect(uploads).toEqual([]);
});

test("a very long title with emoji is truncated, not overflowing", async ({ page }) => {
  await logIn(page, artist, "/login?next=/profile/upload");
  const long = "🎧 " + "Very long title ".repeat(6).trim();
  await page.getByLabel("Title", { exact: true }).fill(long.slice(0, 100));
  const heading = page.locator("aside").getByRole("heading", { level: 3 });
  await expect(heading).toHaveCSS("text-overflow", "ellipsis");
  const box = await heading.boundingBox();
  const card = await page.locator("aside article").boundingBox();
  expect(box!.width).toBeLessThanOrEqual(card!.width + 1);
});

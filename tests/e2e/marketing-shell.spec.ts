import { expect, test } from "@playwright/test";
import { logIn } from "../helpers/e2e";
import { createTestUser, deleteTestUser, type TestUser } from "../helpers/users";

let artist: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({ role: "artist", displayName: "E2E Shell" });
});
test.afterAll(async () => {
  if (artist) await deleteTestUser(artist.id);
});

test("a guest sees the header sign-up link and the footer columns", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").getByRole("link", { name: "Sign Up" })).toHaveAttribute("href", "/signup");
  const footer = page.getByRole("contentinfo");
  for (const name of ["Product", "Community", "Company", "Legal"]) {
    await expect(footer.getByRole("heading", { name })).toBeVisible();
  }
});

test("the menu opens as a dialog, closes on Escape and returns focus", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Open menu" });
  await button.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link", { name: "Pricing" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});

test("a signed-in user sees Dashboard in the header", async ({ page }) => {
  await logIn(page, artist);
  await page.goto("/");
  await expect(page.getByRole("banner").getByRole("link", { name: "Dashboard" })).toBeVisible();
});

test("the newsletter validates the email and confirms", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByLabel("Email").fill("not-an-email");
  await footer.getByRole("button", { name: "Subscribe" }).click();
  await expect(footer.getByText("Enter a valid email address")).toBeVisible();
  await footer.getByLabel("Email").fill("you@artist.com");
  await footer.getByRole("button", { name: "Subscribe" }).click();
  await expect(footer.getByText("Thanks! Curator drops are coming soon.")).toBeVisible();
});

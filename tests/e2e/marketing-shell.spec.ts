import { expect, test } from "@playwright/test";
import { logIn } from "../helpers/e2e";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "../helpers/users";

let artist: TestUser;

test.beforeAll(async () => {
  artist = await createTestUser({ role: "artist", displayName: "E2E Shell" });
});
test.afterAll(async () => {
  if (artist) await deleteTestUser(artist.id);
});

test("a guest sees the header sign-up link and the footer columns", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Sign Up" }),
  ).toHaveAttribute("href", "/signup");
  const footer = page.getByRole("contentinfo");
  for (const name of ["Product", "Community", "Company", "Legal"]) {
    await expect(footer.getByRole("heading", { name })).toBeVisible();
  }
});

test("the menu opens as a dialog, closes on Escape and returns focus", async ({
  page,
}) => {
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
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Dashboard" }),
  ).toBeVisible();
});

test("the newsletter validates the email and confirms", async ({
  page,
  context,
}) => {
  // On the full-length home the footer form scrolls in under the cookie banner.
  await context.addCookies([
    { name: "rr_consent", value: "v1.0.0", url: "http://localhost:3000" },
  ]);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByLabel("Email").fill("not-an-email");
  await footer.getByRole("button", { name: "Subscribe" }).click();
  await expect(footer.getByText("Enter a valid email address")).toBeVisible();
  await footer.getByLabel("Email").fill("you@artist.com");
  await footer.getByRole("button", { name: "Subscribe" }).click();
  await expect(
    footer.getByText("Thanks! Curator drops are coming soon."),
  ).toBeVisible();
});

test("the menu fills the viewport even after the header has blurred on scroll", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.body.style.minHeight = "3000px";
    window.scrollTo(0, 400);
  });
  await page.waitForFunction(() => window.scrollY > 40);
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link", { name: "Pricing" })).toBeVisible();
  const box = await dialog.boundingBox();
  const innerHeight = await page.evaluate(() => window.innerHeight);
  expect(box!.height).toBeGreaterThan(innerHeight - 2);
});

test("the open menu traps keyboard focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(
      () => !!document.activeElement?.closest("dialog"),
    );
    expect(inside).toBe(true);
  }
});

import { expect, test, type Page } from "@playwright/test";

// These tests are about the page, not the cookie banner that would cover its lower part.
test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "rr_consent", value: "v1.0.0", url: "http://localhost:3000" },
  ]);
});

const H2_ORDER = [
  "Get heard by new fans",
  "Go ahead, live from your music !",
  "Three promises",
  "Pitch to the right ears",
  "Test before you pitch",
  "Rate & earn",
  "Find your next collab",
  "Artists who got heard",
  "Your next fans are listening",
];

/** Collects uncaught page errors and console errors for the whole test. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return errors;
}

/** Normalised text of every h2, in document order. */
async function h2Texts(page: Page) {
  return page
    .locator("main h2")
    .evaluateAll((els) =>
      els.map((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim()),
    );
}

test("the hero shows the title and the two calls to action", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "ReachRadar", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Start pitching", exact: true }),
  ).toHaveAttribute("href", "/signup");
  await expect(
    page.getByRole("link", { name: "Rate songs, earn credits" }),
  ).toHaveAttribute("href", "/rate");
});

test("the sections come in the Figma order", async ({ page }) => {
  await page.goto("/");
  const texts = await h2Texts(page);
  expect(texts.map((t) => t.toLowerCase())).toEqual(
    H2_ORDER.map((t) => t.toLowerCase()),
  );
});

test("at most one gradient title shows in the first screen", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible();
  const inView = await page.locator(".text-gradient").evaluateAll(
    (els) =>
      els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
      }).length,
  );
  expect(inView).toBeLessThanOrEqual(1);
});

test("loads without page or console errors, also after a client navigation back", async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/anim-pending/, {
    timeout: 3000,
  });
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("link", { name: "Start pitching", exact: true }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "ReachRadar", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/anim-pending/);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test("Scroll down jumps to the Get heard section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Scroll down" }).click();
  await expect(page).toHaveURL(/#get-heard$/);
  await expect(page.locator("#get-heard")).toBeInViewport();
});

test("the live tabs switch selection", async ({ page }) => {
  await page.goto("/");
  const teaser = page.getByRole("tab", { name: "Teaser trailer" });
  const behind = page.getByRole("tab", { name: "Behind the scenes" });
  await expect(teaser).toHaveAttribute("aria-selected", "true");
  await behind.click();
  await expect(behind).toHaveAttribute("aria-selected", "true");
  await expect(teaser).toHaveAttribute("aria-selected", "false");
});

test("Play track toggles its pressed state", async ({ page }) => {
  await page.goto("/");
  // The button pops in (scale 0 → 1) when the player card scrolls into view.
  await page.getByText("Anonymous track #4821").scrollIntoViewIfNeeded();
  const play = page.getByRole("button", { name: "Play track" });
  await expect(play).toHaveAttribute("aria-pressed", "false");
  await play.click();
  await expect(play).toHaveAttribute("aria-pressed", "true");
  await play.click();
  await expect(play).toHaveAttribute("aria-pressed", "false");
});

test("every section title is fully shown once scrolled into view", async ({
  page,
}) => {
  await page.goto("/");
  for (const h2 of await page.locator("main h2").all()) {
    await h2.scrollIntoViewIfNeeded();
    await expect(h2).toBeVisible();
    await expect(h2).toHaveCSS("opacity", "1", { timeout: 4000 });
  }
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("every title is visible right after load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/anim-pending/);
    const h2s = page.locator("main h2");
    await expect(h2s).toHaveCount(H2_ORDER.length);
    for (const h2 of await h2s.all()) {
      await expect(h2).toBeVisible();
      await expect(h2).toHaveCSS("opacity", "1");
    }
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the title and the main call to action are visible", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "ReachRadar", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Start pitching", exact: true }),
    ).toBeVisible();
  });
});

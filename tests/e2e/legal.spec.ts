import { expect, test } from "@playwright/test";
import { getLegalDoc } from "../../src/content/legal";
import { LEGAL_DOCS } from "../../src/lib/site";

// These tests are about the pages, not the cookie banner that would cover their lower part.
test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "rr_consent", value: "v1.0.0", url: "http://localhost:3000" },
  ]);
});

for (const { slug, label } of LEGAL_DOCS) {
  test(`/legal/${slug}: title, tabs and table of contents`, async ({
    page,
  }) => {
    const doc = getLegalDoc(slug)!;
    const res = await page.goto(`/legal/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: doc.title }),
    ).toBeVisible();
    const tabs = page.getByRole("navigation", { name: "Legal documents" });
    await expect(tabs.getByRole("link", { name: label })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(tabs.getByRole("link")).toHaveCount(LEGAL_DOCS.length);
    const toc = page.getByRole("navigation", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveCount(doc.sections.length);
  });
}

test("a TOC entry lands on its heading, clear of the header, and is marked current", async ({
  page,
}) => {
  await page.goto("/legal/privacy");
  const toc = page.getByRole("navigation", { name: "On this page" });
  await toc.getByRole("link", { name: /07\s*Your rights/ }).click();
  await expect(page).toHaveURL(/#your-rights$/);

  const heading = page.getByRole("heading", { level: 2, name: "Your rights" });
  await expect(heading).toBeInViewport();
  const headerHeight = await page
    .locator("header")
    .first()
    .evaluate((el) => el.getBoundingClientRect().height);
  const box = await heading.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(headerHeight);

  await expect(
    toc.getByRole("link", { name: /07\s*Your rights/ }),
  ).toHaveAttribute("aria-current", "location");
  await expect(toc.locator('[aria-current="location"]')).toHaveCount(1);
});

test("the TOC follows the scroll position", async ({ page }) => {
  await page.goto("/legal/privacy");
  const toc = page.getByRole("navigation", { name: "On this page" });
  await expect(
    toc.getByRole("link", { name: /01\s*Who we are/ }),
  ).toHaveAttribute("aria-current", "location");
  await page.locator("#security").scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const el = document.getElementById("security")!;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150);
  });
  await expect(
    toc.getByRole("link", { name: /08\s*Security/ }),
  ).toHaveAttribute("aria-current", "location");
});

test("an unknown document is a 404", async ({ page }) => {
  const res = await page.goto("/legal/unknown");
  expect(res?.status()).toBe(404);
});

test("the legal notice has a contact section for the footer link", async ({
  page,
}) => {
  await page.goto("/legal/legal-notice#contact");
  await expect(page.locator("section#contact")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Contact" }),
  ).toBeInViewport();
});

test("the cookie page hosts the preferences and saving sets the cookie", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/legal/cookies#preferences");
  const section = page.locator("section#preferences");
  await expect(
    section.getByRole("switch", { name: "Analytics" }),
  ).toBeVisible();
  await section.getByRole("switch", { name: "Analytics" }).click();
  await section.getByRole("button", { name: "Save my choices" }).click();
  await expect
    .poll(
      async () =>
        (await context.cookies()).find((c) => c.name === "rr_consent")?.value,
    )
    .toBe("v1.1.0");
});

test("the cookie table scrolls inside its own frame at 375px; no page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  for (const { slug } of LEGAL_DOCS) {
    await page.goto(`/legal/${slug}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, slug).toBe(false);
  }
  await page.goto("/legal/cookies");
  const frame = page.getByTestId("legal-table");
  const scrolls = await frame.evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(scrolls).toBe(true);
});

test("under 1100px the TOC stacks above the text and is not sticky", async ({
  page,
}) => {
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto("/legal/privacy");
  const toc = page.getByRole("navigation", { name: "On this page" });
  const aside = toc.locator("xpath=..");
  expect(await aside.evaluate((el) => getComputedStyle(el).position)).toBe(
    "static",
  );
  const tocBox = await toc.boundingBox();
  const firstSection = await page.locator("section#who-we-are").boundingBox();
  expect(tocBox!.y + tocBox!.height).toBeLessThanOrEqual(firstSection!.y);
});

test("on desktop the TOC column is sticky", async ({ page }) => {
  await page.goto("/legal/privacy");
  const toc = page.getByRole("navigation", { name: "On this page" });
  const aside = toc.locator("xpath=..");
  expect(await aside.evaluate((el) => getComputedStyle(el).position)).toBe(
    "sticky",
  );
});

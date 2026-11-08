import { expect, test } from "@playwright/test";
import { LEGAL_DOCS } from "../../src/lib/site";

// These tests are about layout, not the cookie banner that would cover the page.
test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "rr_consent", value: "v1.0.0", url: "http://localhost:3000" },
  ]);
});

const PATHS = [
  "/",
  "/pricing",
  ...LEGAL_DOCS.map(({ slug }) => `/legal/${slug}`),
];
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
];

for (const viewport of VIEWPORTS) {
  for (const path of PATHS) {
    test(`${path} at ${viewport.width}px: no horizontal overflow`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      // Measure the resting layout: scroll reveals start elements offset (x: -40)
      // until they enter the viewport, which is not real overflow.
      await page.emulateMedia({ reducedMotion: "reduce" });
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState("networkidle");

      const pageOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(pageOverflow).toBeLessThanOrEqual(0);

      // Elements wider than the viewport, ignoring those clipped or scrolled by
      // an ancestor and those that are visually hidden (sr-only, zero-size).
      const wide = await page.evaluate(() => {
        const vw = window.innerWidth;
        const clipped = (el: Element) => {
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox === "auto" || ox === "scroll" || ox === "hidden")
              return true;
          }
          return false;
        };
        return Array.from(document.querySelectorAll("main *"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return false;
            if (getComputedStyle(el).visibility === "hidden") return false;
            if (r.width <= vw && r.right <= vw + 1 && r.left >= -1)
              return false;
            return !clipped(el);
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} left=${Math.round(r.left)} width=${Math.round(r.width)}`;
          });
      });
      expect(wide).toEqual([]);
    });
  }
}

test("pricing cards stack on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/pricing");
  const boxes = await page.locator("main article").evaluateAll((els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y + window.scrollY };
    }),
  );
  expect(boxes).toHaveLength(4);
  for (const b of boxes)
    expect(Math.abs(b.x - boxes[0].x)).toBeLessThanOrEqual(1);
  for (let i = 1; i < boxes.length; i++)
    expect(boxes[i].y).toBeGreaterThan(boxes[i - 1].y);
});

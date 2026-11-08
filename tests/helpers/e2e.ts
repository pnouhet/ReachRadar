import type { Page } from "@playwright/test";
import type { TestUser } from "./users";

export async function logIn(page: Page, user: TestUser, path = "/login") {
  await page.goto(path);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

/** Draws a solid-colour PNG of the given size in the browser and returns its bytes. */
export async function makePng(page: Page, width: number, height: number, color = "#059bc0"): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    ({ width, height, color }) => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      return c.toDataURL("image/png");
    },
    { width, height, color },
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

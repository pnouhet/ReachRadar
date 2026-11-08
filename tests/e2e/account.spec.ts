import { expect, test } from "@playwright/test";
import { logIn } from "../helpers/e2e";
import { createTestUser, deleteTestUser, type TestUser } from "../helpers/users";

let user: TestUser;

test.beforeAll(async () => {
  user = await createTestUser({ role: "artist", displayName: "Account Tester" });
});
test.afterAll(async () => {
  if (user) await deleteTestUser(user.id);
});

test("a wrong current password is refused", async ({ page }) => {
  await logIn(page, user, "/login?next=/settings/account");
  await page.getByLabel("Current password", { exact: true }).fill("not-my-password-1");
  await page.getByLabel("New password", { exact: true }).fill("Brand-new-pass-42");
  await page.getByLabel("Confirm new password").fill("Brand-new-pass-42");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Current password is incorrect.")).toBeVisible();
});

test("an artist changes their password and logs in with the new one", async ({ page }) => {
  await logIn(page, user, "/login?next=/settings/account");
  await expect(page.getByLabel("Email")).toHaveValue(user.email);

  const next = "Brand-new-pass-42";
  await page.getByLabel("Current password", { exact: true }).fill(user.password);
  await page.getByLabel("New password", { exact: true }).fill(next);
  await page.getByLabel("Confirm new password").fill(next);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Password updated" })).toBeVisible();

  await page.context().clearCookies();
  await logIn(page, { ...user, password: next });
  await expect(page).toHaveURL(/\/dashboard$/);
});

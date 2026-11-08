import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { adminClient, createTestUser, deleteTestUser, type TestUser } from "../helpers/users";

const created: TestUser[] = [];
afterAll(async () => {
  for (const u of created) await deleteTestUser(u.id);
});

function run(...args: string[]) {
  return spawnSync(process.execPath, ["scripts/admin.mjs", ...args], { encoding: "utf8" });
}

describe("npm run admin:grant / admin:revoke", () => {
  it("grants and revokes admin for a confirmed account", async () => {
    const u = await createTestUser({ role: "artist", displayName: "Script Admin" });
    created.push(u);

    const grant = run("grant", u.email);
    expect(grant.status, grant.stderr).toBe(0);
    expect(grant.stdout).toContain("is now an admin");
    const { data } = await adminClient().from("profiles").select("role").eq("id", u.id).single();
    expect(data?.role).toBe("admin");

    const revoke = run("revoke", u.email);
    expect(revoke.status, revoke.stderr).toBe(0);
    expect(revoke.stdout).toContain("is back to artist");
  });

  it("fails clearly for an unknown email", () => {
    const r = run("grant", `nobody+${randomUUID()}@example.com`);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("no confirmed account");
  });

  it("prints usage without arguments", () => {
    const r = run();
    expect(r.status).toBe(1);
    expect(r.stderr.toLowerCase()).toContain("usage");
  });
});

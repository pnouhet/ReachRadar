import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  resend: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
  getUser: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: async () => ({ auth }) }));

class Redirect extends Error {
  constructor(public to: string) {
    super(`REDIRECT ${to}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new Redirect(to);
  },
}));

const { signIn, signUp, requestPasswordReset, changePassword } = await import("@/lib/auth/actions");

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const initial = { ok: false } as const;

beforeEach(() => {
  for (const fn of Object.values(auth)) fn.mockReset();
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
});

describe("signIn", () => {
  it("asks unconfirmed users to confirm their email and offers a resend", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: { code: "email_not_confirmed", message: "x" } });
    const r = await signIn(initial, form({ email: "a@b.co", password: "x" }));
    expect(r).toMatchObject({ ok: false, error: "Please confirm your email first.", fieldErrors: { resend: "a@b.co" } });
  });

  it("reports wrong credentials without saying which field is wrong", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: { code: "invalid_credentials", message: "x" } });
    const r = await signIn(initial, form({ email: "a@b.co", password: "x" }));
    expect(r.error).toBe("Wrong email or password.");
  });

  it("never redirects to another site after login", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { user: {} }, error: null });
    await expect(signIn(initial, form({ email: "a@b.co", password: "x", next: "//evil.com" }))).rejects.toMatchObject({
      to: "/dashboard",
    });
  });

  it("returns to the requested app page after login", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { user: {} }, error: null });
    await expect(
      signIn(initial, form({ email: "a@b.co", password: "x", next: "/settings/profile" })),
    ).rejects.toMatchObject({ to: "/settings/profile" });
  });
});

describe("signUp", () => {
  it("sends role, name and curator type as user metadata", async () => {
    auth.signUp.mockResolvedValue({ data: { user: { identities: [{}] } }, error: null });
    await expect(
      signUp(
        initial,
        form({
          role: "curator",
          displayName: "Late Night Indie",
          email: "Hello@LateNight.com",
          password: "midnight24",
          terms: "on",
          curatorType: "label",
        }),
      ),
    ).rejects.toMatchObject({ to: "/signup/check-email?email=hello%40latenight.com" });
    const call = auth.signUp.mock.calls[0][0];
    expect(call.email).toBe("hello@latenight.com");
    expect(call.options.data).toMatchObject({ role: "curator", display_name: "Late Night Indie", curator_type: "label" });
    expect(call.options.emailRedirectTo).toBe("http://localhost:3000/auth/confirm?next=/dashboard");
  });

  it("returns field errors instead of calling Supabase on invalid input", async () => {
    const r = await signUp(initial, form({ role: "artist", displayName: "A", email: "nope", password: "short", terms: "on" }));
    expect(r.ok).toBe(false);
    expect(Object.keys(r.fieldErrors ?? {})).toEqual(expect.arrayContaining(["displayName", "email", "password"]));
    expect(auth.signUp).not.toHaveBeenCalled();
  });
});

describe("requestPasswordReset", () => {
  it("answers the same way whether or not the account exists", async () => {
    auth.resetPasswordForEmail.mockResolvedValueOnce({ data: {}, error: null });
    auth.resetPasswordForEmail.mockResolvedValueOnce({ data: {}, error: { code: "user_not_found", message: "x" } });
    const a = await requestPasswordReset(initial, form({ email: "known@b.co" }));
    const b = await requestPasswordReset(initial, form({ email: "unknown@b.co" }));
    expect(a).toEqual(b);
    expect(a.message).toBe("If an account exists, we sent you a link.");
  });
});

describe("changePassword", () => {
  beforeEach(() => {
    auth.getUser.mockResolvedValue({ data: { user: { email: "me@b.co" } }, error: null });
  });

  it("refuses when the current password is wrong", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: { code: "invalid_credentials", message: "x" } });
    const r = await changePassword(initial, form({ current: "nope", password: "midnight24", confirm: "midnight24" }));
    expect(r.fieldErrors?.current).toBe("Current password is incorrect.");
    expect(auth.updateUser).not.toHaveBeenCalled();
  });

  it("refuses a confirmation that does not match", async () => {
    const r = await changePassword(initial, form({ current: "old", password: "midnight24", confirm: "midnight25" }));
    expect(r.fieldErrors?.confirm).toBe("Passwords don't match.");
  });

  it("updates the password after re-checking the current one", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { user: {} }, error: null });
    auth.updateUser.mockResolvedValue({ data: {}, error: null });
    const r = await changePassword(initial, form({ current: "old", password: "midnight24", confirm: "midnight24" }));
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: "me@b.co", password: "old" });
    expect(auth.updateUser).toHaveBeenCalledWith({ password: "midnight24" });
    expect(r).toEqual({ ok: true, message: "Password updated. You stay signed in on this device." });
  });
});

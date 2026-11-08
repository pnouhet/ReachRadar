"use server";

import { redirect } from "next/navigation";
import { fieldErrorsOf, formObject, type ActionState } from "@/lib/action-state";
import { siteUrl } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeNext } from "./safe-next";
import { emailSchema, newPasswordSchema, signInSchema, signUpSchema } from "./schemas";

const HOME = "/dashboard";

function confirmUrl(next: string) {
  return `${siteUrl()}/auth/confirm?next=${next}`;
}

export async function signUp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signUpSchema.safeParse(formObject(formData));
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  const { email, password, role, displayName, curatorType, playlistLink } = parsed.data;

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: confirmUrl(HOME),
      data: {
        role,
        display_name: displayName,
        ...(role === "curator" && curatorType ? { curator_type: curatorType } : {}),
        ...(role === "curator" && playlistLink ? { playlist_link: playlistLink } : {}),
      },
    },
  });

  if (error) {
    if (error.code === "email_address_not_authorized") {
      return { ok: false, fieldErrors: { email: "During the test phase, only team email addresses can sign up." } };
    }
    if (error.code === "weak_password") return { ok: false, fieldErrors: { password: error.message } };
    if (error.code === "over_email_send_rate_limit") {
      return { ok: false, error: "Too many emails sent. Please try again in a few minutes." };
    }
    return { ok: false, error: "We couldn't create your account. Please try again." };
  }

  redirect(`/signup/check-email?email=${encodeURIComponent(email)}`);
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const fields = formObject(formData);
  const parsed = signInSchema.safeParse(fields);
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { ok: false, error: "Please confirm your email first.", fieldErrors: { resend: parsed.data.email } };
    }
    return { ok: false, error: "Wrong email or password." };
  }
  redirect(safeNext(fields.next));
}

export async function resendConfirmation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formObject(formData));
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: confirmUrl(HOME) },
  });
  if (error?.code === "over_email_send_rate_limit") {
    return { ok: false, error: "Please wait a minute before asking for another email." };
  }
  return { ok: true, message: "We sent you a new confirmation link." };
}

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formObject(formData));
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  const supabase = await createServerSupabase();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: confirmUrl("/reset-password") });
  return { ok: true, message: "If an account exists, we sent you a link." };
}

export async function updatePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = newPasswordSchema.safeParse(formObject(formData));
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") {
      return { ok: false, fieldErrors: { password: "Choose a password you haven't used before." } };
    }
    return { ok: false, error: "Your reset link has expired. Ask for a new one." };
  }
  redirect(HOME);
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}

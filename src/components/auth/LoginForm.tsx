"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { submitKeepingValues } from "@/lib/forms";
import { resendConfirmation, signIn } from "@/lib/auth/actions";
import { FormMessage } from "./FormMessage";
import { PasswordField } from "./PasswordField";
import { OrWithEmail, SocialButtons } from "./SocialButtons";

/** 02d — Log in. */
export function LoginForm({ next, linkError }: { next?: string; linkError?: boolean }) {
  const [state, action, pending] = useActionState(signIn, INITIAL_ACTION_STATE);
  const [resendState, resendAction, resending] = useActionState(resendConfirmation, INITIAL_ACTION_STATE);
  const fe = state.fieldErrors ?? {};
  const unconfirmedEmail = fe.resend;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <h1 className="text-page-title">Log in</h1>
        <p className="text-body-md text-soft-white">Artists and professionals use the same login.</p>
      </div>
      <SocialButtons />
      <OrWithEmail />

      {linkError && !state.error && (
        <FormMessage tone="error">That link is invalid or has expired. Log in or ask for a new one.</FormMessage>
      )}
      {state.error && (
        <FormMessage tone="error">
          <p>{state.error}</p>
          {unconfirmedEmail && (
            <form action={resendAction} className="mt-2">
              <input type="hidden" name="email" value={unconfirmedEmail} />
              <button type="submit" disabled={resending} className="text-label-strong text-cyan hover:underline">
                Resend email
              </button>
            </form>
          )}
        </FormMessage>
      )}
      {resendState.message && <FormMessage tone="success">{resendState.message}</FormMessage>}

      <form action={action} onSubmit={submitKeepingValues(action)} className="flex flex-col gap-7" noValidate>
        {next && <input type="hidden" name="next" value={next} />}
        <div className="flex flex-col gap-5">
          <Input label="Email" name="email" type="email" autoComplete="email" required error={fe.email} />
          <PasswordField error={fe.password} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Checkbox name="remember" label="Keep me logged in" defaultChecked />
          <Link href="/forgot-password" className="text-label-strong text-cyan hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" loading={pending} className="self-center">
          Log in
        </Button>
      </form>
    </div>
  );
}

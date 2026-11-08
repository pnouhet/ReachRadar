"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { submitKeepingValues } from "@/lib/forms";
import { requestPasswordReset, resendConfirmation, updatePassword } from "@/lib/auth/actions";
import { FormMessage } from "./FormMessage";
import { PasswordField } from "./PasswordField";

export function ResendConfirmationForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(resendConfirmation, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="email" value={email} />
      {state.message && <FormMessage tone="success">{state.message}</FormMessage>}
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      <Button type="submit" variant="secondary" loading={pending} className="self-center">
        Resend the email
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, INITIAL_ACTION_STATE);
  return (
    <form action={action} onSubmit={submitKeepingValues(action)} className="flex flex-col gap-7" noValidate>
      {state.message && <FormMessage tone="success">{state.message}</FormMessage>}
      <Input label="Email" name="email" type="email" autoComplete="email" required error={state.fieldErrors?.email} />
      <Button type="submit" variant="primary" loading={pending} className="self-center">
        Send me a reset link
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, INITIAL_ACTION_STATE);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} onSubmit={submitKeepingValues(action)} className="flex flex-col gap-7" noValidate>
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      <PasswordField
        label="New password"
        helper="At least 8 characters with a number."
        error={fe.password}
        showStrength
        autoComplete="new-password"
      />
      <Input label="Confirm password" name="confirm" type="password" autoComplete="new-password" required error={fe.confirm} />
      <Button type="submit" variant="primary" loading={pending} className="self-center">
        Save my new password
      </Button>
    </form>
  );
}

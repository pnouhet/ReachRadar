"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/auth/FormMessage";
import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { changePassword } from "@/lib/auth/actions";
import { SettingsGroup } from "./SettingsGroup";

/** 16b — Password group with a real password change. */
export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, INITIAL_ACTION_STATE);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="flex flex-col gap-8" key={state.ok ? state.message : "form"}>
      {state.ok && state.message && <FormMessage tone="success">{state.message}</FormMessage>}
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}
      <SettingsGroup title="Password" description="Use 12 characters or more, with a number and a symbol.">
        <PasswordField label="Current password" name="current" error={fe.current} autoComplete="current-password" />
        <PasswordField
          label="New password"
          helper="At least 8 characters with a number."
          error={fe.password}
          showStrength
          autoComplete="new-password"
        />
        <PasswordField label="Confirm new password" name="confirm" error={fe.confirm} autoComplete="new-password" />
      </SettingsGroup>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" loading={pending}>
          Save changes
        </Button>
        <Button type="reset" variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
}

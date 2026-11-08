"use client";

import { ShieldCheck } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { submitKeepingValues } from "@/lib/forms";
import { signUp } from "@/lib/auth/actions";
import { CURATOR_TYPES, CURATOR_TYPE_LABEL, type CuratorType } from "@/lib/auth/schemas";
import type { Role } from "@/lib/nav";
import { FormMessage } from "./FormMessage";
import { PasswordField } from "./PasswordField";
import { OrWithEmail, SocialButtons } from "./SocialButtons";
import { StepIndicator } from "./StepIndicator";

/** 02b (artist) and 02c (professional) sign-up forms. */
export function SignUpForm({ role }: { role: Role }) {
  const [state, action, pending] = useActionState(signUp, INITIAL_ACTION_STATE);
  const [curatorType, setCuratorType] = useState<CuratorType>("playlist");
  const fe = state.fieldErrors ?? {};
  const isArtist = role === "artist";

  return (
    <form action={action} onSubmit={submitKeepingValues(action)} className="flex flex-col gap-7" noValidate>
      <input type="hidden" name="role" value={role} />
      <StepIndicator step={2} />
      <div className="flex flex-col gap-3">
        <h1 className="text-page-title">{isArtist ? "Join as an artist" : "Join as a pro"}</h1>
        <p className="text-body-md text-soft-white">
          {isArtist
            ? "2 minutes, no card needed. 2 free credits after your first upload."
            : "Receive pitches that match your taste, and earn for every review."}
        </p>
      </div>

      {isArtist ? (
        <>
          <SocialButtons />
          <OrWithEmail />
        </>
      ) : (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-label-strong text-soft-white">I run a…</legend>
          <input type="hidden" name="curatorType" value={curatorType} />
          <div className="flex flex-wrap gap-2.5">
            {CURATOR_TYPES.map((t) => (
              <Chip key={t} active={curatorType === t} onClick={() => setCuratorType(t)}>
                {CURATOR_TYPE_LABEL[t]}
              </Chip>
            ))}
          </div>
        </fieldset>
      )}

      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}

      <div className="flex flex-col gap-5">
        <Input
          label={isArtist ? "Artist name" : "Curator or brand name"}
          name="displayName"
          autoComplete="nickname"
          required
          maxLength={60}
          helper={isArtist ? "Shown on your public profile. You can change it later." : "Displayed to artists on your curator page."}
          error={fe.displayName}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          helper={isArtist ? "We'll send you a confirmation link." : "Use a professional address if you have one."}
          error={fe.email}
        />
        <PasswordField
          helper="At least 8 characters with a number."
          error={fe.password}
          showStrength={isArtist}
          autoComplete="new-password"
        />
        {!isArtist && curatorType === "playlist" && (
          <Input
            label="Playlist link"
            name="playlistLink"
            type="url"
            inputMode="url"
            placeholder="open.spotify.com/playlist/…"
            helper="Paste the link of one of your playlists."
            error={fe.playlistLink}
          />
        )}
      </div>

      {!isArtist && (
        <div className="flex items-center gap-3 border border-border-subtle bg-surface-1 px-4 py-3 text-body-sm text-soft-white">
          <ShieldCheck size={20} strokeWidth={1.5} className="shrink-0 text-cyan" aria-hidden />
          We verify every curator within 48 h to keep ReachRadar free of bots and fake playlists.
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Checkbox
          name="terms"
          required
          error={fe.terms}
          label={isArtist ? "I accept the Terms of use and Privacy policy" : "I accept the Curator terms and Privacy policy"}
        />
        {isArtist && <Checkbox name="newsletter" label="Send me weekly curator drops (optional)" />}
      </div>

      <Button type="submit" variant="primary" loading={pending} className="self-center">
        {isArtist ? "Create my account" : "Submit for verification"}
      </Button>
    </form>
  );
}

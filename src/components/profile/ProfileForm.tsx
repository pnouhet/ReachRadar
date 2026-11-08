"use client";

import { useActionState, useState } from "react";
import { FormMessage } from "@/components/auth/FormMessage";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { FEATURED_GENRES, GENRES } from "@/lib/genres";
import { updateProfile } from "@/lib/profile/actions";
import type { Profile } from "@/lib/profile/queries";
import { LINK_FIELDS } from "@/lib/profile/schemas";

const MAX_GENRES = 5;

/** 16a — About you, Your genres, Links, Save changes / Cancel. */
export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, INITIAL_ACTION_STATE);
  const [genres, setGenres] = useState<string[]>(profile.genres);
  const [showAll, setShowAll] = useState(false);
  const fe = state.fieldErrors ?? {};
  const isArtist = profile.role === "artist";

  const visible = showAll ? GENRES : Array.from(new Set([...FEATURED_GENRES, ...genres]));
  const toggle = (g: string) =>
    setGenres((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : cur.length < MAX_GENRES ? [...cur, g] : cur));

  return (
    <form action={action} className="flex flex-col gap-8">
      {state.ok && state.message && <FormMessage tone="success">{state.message}</FormMessage>}
      {state.error && <FormMessage tone="error">{state.error}</FormMessage>}

      <SettingsGroup title="About you">
        <Input
          label={isArtist ? "Artist name" : "Curator or brand name"}
          name="displayName"
          defaultValue={profile.displayName}
          maxLength={60}
          required
          helper="Shown everywhere on ReachRadar."
          error={fe.displayName}
        />
        <Textarea
          label="Bio"
          name="bio"
          rows={3}
          maxLength={300}
          showCount
          defaultValue={profile.bio ?? ""}
          placeholder="Who you are, what you make, where you've been released."
          error={fe.bio}
        />
        <Input
          label="Location"
          name="location"
          maxLength={80}
          defaultValue={profile.location ?? ""}
          placeholder="City, country"
          autoComplete="address-level2"
          error={fe.location}
        />
      </SettingsGroup>

      <SettingsGroup title="Your genres" description="Up to 5. Curators and the pre-test queue use them for matching.">
        {genres.map((g) => (
          <input key={g} type="hidden" name="genres" value={g} />
        ))}
        <div className="flex flex-wrap gap-2">
          {visible.map((g) => (
            <Chip key={g} active={genres.includes(g)} onClick={() => toggle(g)}>
              {g}
            </Chip>
          ))}
          {!showAll && (
            <Chip onClick={() => setShowAll(true)}>+ More genres</Chip>
          )}
        </div>
        <p className="text-body-sm text-muted" aria-live="polite">
          {genres.length} / {MAX_GENRES} selected{fe.genres ? ` · ${fe.genres}` : ""}
        </p>
      </SettingsGroup>

      <SettingsGroup title="Links" description="Curators open them before answering.">
        <div className="grid gap-4 sm:grid-cols-2">
          {LINK_FIELDS.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              name={`links.${f.key}`}
              defaultValue={profile.links[f.key as keyof typeof profile.links] ?? ""}
              placeholder={f.placeholder}
              inputMode="url"
              error={fe[`links.${f.key}`]}
            />
          ))}
        </div>
      </SettingsGroup>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" loading={pending}>
          Save changes
        </Button>
        <Button type="reset" variant="ghost" onClick={() => setGenres(profile.genres)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

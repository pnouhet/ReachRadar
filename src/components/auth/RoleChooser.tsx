"use client";

import { Briefcase, Mic, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/nav";

const ROLES: { role: Role; title: string; body: string; perks: string; icon: LucideIcon; cta: string }[] = [
  {
    role: "artist",
    title: "I'm an artist",
    body: "Singer, rapper, producer or band. Pitch your songs and grow your fanbase.",
    perks: "Pitch to curators · Rate & earn · Find collabs",
    icon: Mic,
    cta: "Continue as an artist",
  },
  {
    role: "curator",
    title: "I'm a professional",
    body: "Playlist curator, label, radio or blog. Discover new talent and get paid to listen.",
    perks: "Receive pitches · Earn per review · Verified badge",
    icon: Briefcase,
    cta: "Continue as a professional",
  },
];

/** 02a — Role Card list (Figma 4418:39) as a radio group, then the Continue CTA. */
export function RoleChooser() {
  const [role, setRole] = useState<Role>("artist");
  const current = ROLES.find((r) => r.role === role)!;

  return (
    <div className="flex flex-col gap-10">
      <div role="radiogroup" aria-label="Profile type" className="flex flex-col gap-4">
        {ROLES.map(({ role: r, title, body, perks, icon: Icon }) => {
          const selected = r === role;
          return (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setRole(r)}
              className={cn(
                "flex w-full items-start gap-4 rounded-[2px] p-4 text-left transition-colors sm:gap-5 sm:p-6",
                selected ? "border-[1.5px] border-cyan bg-surface-2" : "border border-border-subtle bg-surface-1 hover:bg-surface-2",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "slant flex h-[52px] w-[60px] shrink-0 items-center justify-center [--slant-h:52px]",
                  selected
                    ? "[--slant-bg:var(--color-cyan)] [--slant-border:var(--color-cyan)]"
                    : "[--slant-border:var(--color-border-strong)]",
                )}
              >
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <span className="flex flex-1 flex-col gap-2">
                <span className="text-heading-card uppercase sm:text-heading-h3">{title}</span>
                <span className="text-body-md text-soft-white">{body}</span>
                <span className="text-body-sm text-cyan">{perks}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px]",
                  selected ? "border-cyan" : "border-border-strong",
                )}
              >
                {selected && <span className="size-2.5 rounded-full bg-cyan" />}
              </span>
            </button>
          );
        })}
      </div>
      <Button variant="primary" href={`/signup/${role}`} className="self-center">
        {current.cta}
      </Button>
    </div>
  );
}

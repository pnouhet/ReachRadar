"use client";

import Image from "next/image";
import { useRef } from "react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/Button";
import { Panel } from "./Panel";

export type ArtworkState = { path: string; url: string; label: string };

type ArtworkPanelProps = {
  artwork: ArtworkState | null;
  pending: boolean;
  error: string | null;
  onPick: (file: File) => void;
  onRemove: () => void;
};

/** 17a · 02 Artwork — 160px preview, specs, Replace / Remove. */
export function ArtworkPanel({ artwork, pending, error, onPick, onRemove }: ArtworkPanelProps) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <Panel number="02" title="Artwork">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Artwork"
        data-testid="artwork-input"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative size-40 shrink-0 overflow-hidden bg-linear-to-br from-cyan via-surface-3 to-midnight">
          {artwork && <Image src={artwork.url} alt="Artwork preview" fill sizes="160px" className="object-cover" />}
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          {artwork && <p className="truncate text-body-md">{artwork.label}</p>}
          <p className="text-body-sm text-muted">JPG or PNG, square. 1000 × 1000 minimum, 3000 × 3000 recommended.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary" loading={pending} onClick={() => input.current?.click()}>
              {artwork ? "Replace artwork" : "Add artwork"}
            </Button>
            {artwork && (
              <Button variant="ghost" disabled={pending} onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
      {error && <FormMessage tone="error">{error}</FormMessage>}
    </Panel>
  );
}

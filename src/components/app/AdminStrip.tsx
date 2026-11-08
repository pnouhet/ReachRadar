import { ArrowLeftRight, Palette } from "lucide-react";
import Link from "next/link";
import { switchView } from "@/lib/auth/view-actions";
import type { Role } from "@/lib/nav";

const LABEL: Record<Role, string> = { artist: "artist", curator: "curator" };

/** Admins only: thin yellow strip above the top bar to flip the whole app between the artist and curator views. */
export function AdminStrip({ view, pathname }: { view: Role; pathname: string }) {
  const other: Role = view === "artist" ? "curator" : "artist";
  return (
    <div
      role="region"
      aria-label="Admin"
      className="flex h-8 items-center gap-3 overflow-hidden bg-warning px-4 text-label-strong whitespace-nowrap text-midnight sm:gap-5 sm:px-8"
    >
      <span className="font-extrabold tracking-[0.06em]">ADMIN</span>
      <span aria-hidden>·</span>
      <span>
        <span className="hidden sm:inline">Viewing as {LABEL[view]}</span>
        <span className="sm:hidden" aria-hidden>
          {view === "artist" ? "Artist" : "Curator"} view
        </span>
      </span>
      <form action={switchView.bind(null, other, pathname)}>
        <button type="submit" className="flex items-center gap-1.5 underline underline-offset-2 hover:no-underline">
          <ArrowLeftRight size={14} strokeWidth={2} aria-hidden />
          <span className="hidden sm:inline">Switch to {LABEL[other]}</span>
          <span className="sm:hidden" aria-hidden>
            Switch
          </span>
          <span className="sr-only sm:hidden">Switch to {LABEL[other]}</span>
        </button>
      </form>
      <span className="flex-1" />
      <Link href="/design-system" className="flex items-center gap-1.5 underline underline-offset-2 hover:no-underline">
        <Palette size={14} strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Design system</span>
        <span className="sr-only sm:hidden">Design system</span>
      </Link>
    </div>
  );
}

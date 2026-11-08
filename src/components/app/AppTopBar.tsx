"use client";

import { Bell, ChevronDown, Menu, Search, Wallet } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { CreditPill } from "@/components/ui/CreditPill";
import { Wordmark } from "@/components/ui/Wordmark";
import { signOut } from "@/lib/auth/actions";
import type { Role } from "@/lib/nav";
import { artistMock, curatorMock } from "@/mocks";

type AppTopBarProps = {
  user: { displayName: string; role: Role; avatarUrl: string | null; isAdmin: boolean };
  menuOpen: boolean;
  onToggleMenu: () => void;
};

const ROLE_LABEL: Record<Role, string> = { artist: "Artist", curator: "Curator" };

/** Figma App Top Bar (4426:30): logo, search, credits (artist) or earnings (curator), notifications, account. */
export function AppTopBar({ user, menuOpen, onToggleMenu }: AppTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border-subtle bg-midnight pr-4 pl-4 sm:gap-6 sm:pr-12 sm:pl-8">
      <button
        type="button"
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        className="-ml-1 flex size-10 items-center justify-center text-soft-white lg:hidden"
      >
        <Menu size={22} strokeWidth={1.5} aria-hidden />
      </button>
      <Link href="/dashboard" aria-label="ReachRadar dashboard" className="shrink-0">
        <Wordmark width={215} className="h-auto w-[130px] sm:w-[215px]" />
      </Link>

      <label className="hidden h-11 w-full max-w-[520px] min-w-0 items-center gap-3 rounded-[2px] border border-border-subtle bg-surface-1 pr-2.5 pl-4 xl:flex">
        <Search size={18} strokeWidth={1.5} className="text-slate" aria-hidden />
        <input
          type="search"
          placeholder="Search artists, curators, playlists…"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-body-md text-white outline-none placeholder:text-muted"
        />
        <kbd className="rounded-[2px] border border-border-strong px-2 py-[3px] text-label-strong text-muted">Ctrl K</kbd>
      </label>

      <div className="flex-1" />

      {user.role === "artist" ? (
        <div className="hidden items-center gap-3 lg:flex">
          <CreditPill credits={artistMock.credits.total} />
          <Link href="/credits" className="text-label-strong whitespace-nowrap text-white hover:text-cyan">
            Buy credits
          </Link>
        </div>
      ) : (
        <div className="hidden items-center gap-3 lg:flex">
          <span className="slant inline-flex h-[34px] items-center gap-2 px-[30px] text-label-strong text-cyan [--slant-h:34px] [--slant-border:var(--color-cyan)]">
            <Wallet size={16} strokeWidth={1.5} aria-hidden />€{curatorMock.earnings.availableEur.toFixed(2)}
          </span>
          <Link href="/earnings" className="text-label-strong whitespace-nowrap text-white hover:text-cyan">
            Withdraw
          </Link>
        </div>
      )}

      <button type="button" aria-label="Notifications" className="relative flex size-10 shrink-0 items-center justify-center text-soft-white">
        <Bell size={22} strokeWidth={1.5} aria-hidden />
        <span className="absolute top-2 right-2 size-2 rounded-full bg-rose" aria-hidden />
      </button>
      <span className="hidden h-8 w-px bg-border-subtle sm:block" aria-hidden />

      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
          <Avatar src={user.avatarUrl} name={user.displayName} size={40} />
          <span className="hidden max-w-48 flex-col xl:flex">
            <span className="truncate text-body-md text-white">{user.displayName}</span>
            <span className="text-body-sm text-muted">{user.isAdmin ? "Admin" : ROLE_LABEL[user.role]}</span>
          </span>
          <ChevronDown size={16} strokeWidth={1.5} className="hidden text-slate group-open:rotate-180 xl:block" aria-hidden />
        </summary>
        <div className="absolute right-0 mt-3 flex w-56 flex-col border border-border-subtle bg-surface-1 py-2">
          <Link href="/profile" className="px-4 py-2.5 text-body-md text-soft-white hover:bg-surface-2 hover:text-white">
            My profile
          </Link>
          <Link href="/settings/profile" className="px-4 py-2.5 text-body-md text-soft-white hover:bg-surface-2 hover:text-white">
            Settings
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full px-4 py-2.5 text-left text-body-md text-soft-white hover:bg-surface-2 hover:text-white">
              Log out
            </button>
          </form>
        </div>
      </details>
    </header>
  );
}

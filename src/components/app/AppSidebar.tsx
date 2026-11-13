import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { closePlayer } from "@/lib/player/store";
import { cn } from "@/lib/cn";
import { matchesPath, navFor, type Role } from "@/lib/nav";
import { artistMock, curatorMock } from "@/mocks";
import { NavItem } from "./NavItem";

type AppSidebarProps = { role: Role; pathname: string; onNavigate?: () => void; className?: string };

function badgeFor(role: Role, href: string): string | undefined {
  if (role === "artist") {
    if (href === "/rate") return `${artistMock.freeCreditsProgress.rated}/${artistMock.freeCreditsProgress.goal}`;
    if (href === "/messages") return String(artistMock.unreadMessages);
  } else {
    if (href === "/inbox") return String(curatorMock.newSubmissions);
    if (href === "/messages") return String(curatorMock.unreadMessages);
  }
  return undefined;
}

/** Figma App Sidebar (4426:67, artist) and its Pro variant (03c, curator). */
export function AppSidebar({ role, pathname, onNavigate, className }: AppSidebarProps) {
  const items = navFor(role);
  // Most specific match wins, so /profile/upload highlights "My profile" and nothing else.
  const activeHref = items
    .filter((i) => matchesPath(pathname, i.href))
    .reduce<string | null>((best, i) => (!best || i.href.length > best.length ? i.href : best), null);

  return (
    <div className={cn("flex h-full flex-col justify-between gap-8 px-4 py-6", className)}>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {items.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.href === activeHref}
            badge={badgeFor(role, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-4">
        {role === "artist" ? <FreeCreditsPromo /> : <StayVerifiedPromo />}
        <form action={signOut} onSubmit={closePlayer}>
          <button
            type="submit"
            className="flex h-12 w-full items-center gap-3.5 pr-3 pl-4 text-body-md text-soft-white hover:text-white"
          >
            <LogOut size={20} strokeWidth={1.5} className="text-slate" aria-hidden />
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

function SegmentBar({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex gap-[3px]" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn("h-1.5 flex-1 -skew-x-12", i < done ? "bg-cyan" : "bg-border-strong")} />
      ))}
    </div>
  );
}

function FreeCreditsPromo() {
  const { rated, goal } = artistMock.freeCreditsProgress;
  return (
    <div className="flex flex-col gap-3 border border-border-subtle bg-surface-2 p-4">
      <p className="text-heading-card uppercase">Free credits</p>
      <p className="text-body-sm text-soft-white">Rate {goal - rated} more songs to unlock +2 credits.</p>
      <SegmentBar done={rated} total={goal} />
    </div>
  );
}

function StayVerifiedPromo() {
  const { onTimeRate } = curatorMock.verified;
  return (
    <div className="flex flex-col gap-3 border border-border-subtle bg-surface-2 p-4">
      <p className="text-heading-card uppercase">Stay verified</p>
      <p className="text-body-sm text-soft-white">{onTimeRate}% of answers on time. Keep it above 90%.</p>
      <SegmentBar done={Math.round(onTimeRate / 5)} total={20} />
    </div>
  );
}

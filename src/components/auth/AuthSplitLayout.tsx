import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { AuthVisualPanel, type AuthPanelCopy } from "./AuthVisualPanel";

type AuthSplitLayoutProps = {
  panel: AuthPanelCopy;
  back: { href: string; label: string };
  switchTo: { prompt: string; href: string; label: string };
  children: ReactNode;
};

export const PANEL_COPY = {
  artist: {
    headline: ["Get heard", "by new fans"],
    body: ["Join 12 000 independent artists and 2 180 verified curators.", "Upload your first track, get 2 free pitch credits."],
  },
  curator: {
    headline: ["Discover", "new talent"],
    body: ["Get pitched by 12 000 independent artists who match your taste.", "Earn credits for every honest review."],
  },
  login: {
    headline: ["Welcome", "back"],
    body: ["Your pitches, feedback and conversations", "are right where you left them."],
  },
} satisfies Record<string, AuthPanelCopy>;

/** Auth screens 02a–02d: photo panel left (desktop only), form column right (520px). */
export function AuthSplitLayout({ panel, back, switchTo, children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-dvh bg-midnight lg:grid-cols-2">
      <AuthVisualPanel {...panel} />
      <main className="flex min-h-dvh min-w-0 flex-col items-center justify-between gap-12 px-6 pt-8 pb-10 sm:px-12 lg:pt-12 xl:px-24">
        <div className="flex w-full flex-col gap-6">
          <Link href="/" className="w-fit lg:hidden" aria-label="ReachRadar home">
            <Wordmark width={240} className="h-3 w-auto" />
          </Link>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <Link href={back.href} className="flex items-center gap-2.5 text-body-md text-soft-white hover:text-white">
              <ArrowLeft size={20} strokeWidth={1.5} aria-hidden />
              {back.label}
            </Link>
            <p className="flex items-center gap-2 text-body-md text-muted">
              {switchTo.prompt}
              <Link href={switchTo.href} className="text-label-strong text-cyan hover:underline">
                {switchTo.label}
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full max-w-[520px]">{children}</div>

        <p className="text-body-sm text-muted">
          <Link href="/legal/terms" className="hover:text-soft-white">
            Terms of use
          </Link>
          {" · "}
          <Link href="/legal/privacy" className="hover:text-soft-white">
            Privacy policy
          </Link>
        </p>
      </main>
    </div>
  );
}

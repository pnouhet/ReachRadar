"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  CONSENT_COOKIE,
  CONSENT_EVENT,
  parseConsent,
  writeConsent,
  type Consent,
} from "@/lib/consent";

function hasConsentCookie(): boolean {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1)) !== null;
}

/** First-visit consent bar (Figma 4465:3260), fixed to the bottom until a choice is saved. */
export function CookieBanner({ initial }: { initial: Consent | null }) {
  const [saved, setSaved] = useState(initial !== null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A back/forward-restored payload may predate a choice made since.
    const onConsent = () => setSaved(true);
    if (hasConsentCookie()) queueMicrotask(onConsent);
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  // Publish the banner height so the page can pad itself and keep its last actions reachable.
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (saved || !el) {
      root.style.removeProperty("--consent-h");
      return;
    }
    const write = () =>
      root.style.setProperty("--consent-h", `${el.offsetHeight}px`);
    write();
    const ro = new ResizeObserver(write);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--consent-h");
    };
  }, [saved]);

  if (saved) return null;

  return (
    <div
      ref={ref}
      data-print-hide
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:px-6 sm:pb-6"
    >
      <section
        role="region"
        aria-label="We use cookies"
        className="pointer-events-auto flex w-full max-w-[1300px] flex-col gap-4 border border-border-subtle bg-surface-1 px-4 py-4 sm:gap-6 sm:px-10 sm:py-8 xl:px-24 xl:py-16"
      >
        <div className="flex items-start gap-4">
          <ShieldCheck
            size={24}
            strokeWidth={1.5}
            className="shrink-0 text-cyan"
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-label-strong uppercase text-white">
              We use cookies
            </p>
            <p className="text-body-sm text-soft-white">
              Some are needed to keep you signed in. With your consent, we also
              use analytics and marketing cookies to improve ReachRadar.
              <br className="hidden md:block" /> You can change your mind at any
              time in the Cookie policy.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:flex-wrap sm:gap-3">
          <Button
            variant="secondary"
            href="/legal/cookies#preferences"
            className="max-sm:flex-1 max-sm:px-2"
          >
            Customize
          </Button>
          <Button
            variant="secondary"
            className="max-sm:flex-1 max-sm:px-2 sm:min-w-[156px]"
            onClick={() => writeConsent({ analytics: false, marketing: false })}
          >
            Reject all
          </Button>
          <Button
            variant="primary"
            className="max-sm:flex-1 max-sm:px-2"
            onClick={() => writeConsent({ analytics: true, marketing: true })}
          >
            Accept all
          </Button>
        </div>
      </section>
    </div>
  );
}

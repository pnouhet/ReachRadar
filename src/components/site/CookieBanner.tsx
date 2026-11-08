"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CONSENT_EVENT, writeConsent, type Consent } from "@/lib/consent";

/** First-visit consent bar (Figma 4465:3260), fixed to the bottom until a choice is saved. */
export function CookieBanner({ initial }: { initial: Consent | null }) {
  const [saved, setSaved] = useState(initial !== null);

  useEffect(() => {
    const onConsent = () => setSaved(true);
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  if (saved) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:px-6 sm:pb-6">
      <section
        role="region"
        aria-label="We use cookies"
        className="pointer-events-auto flex w-full max-w-[1300px] flex-col gap-6 border border-border-subtle bg-surface-1 px-5 py-6 sm:px-10 sm:py-8 xl:px-24 xl:py-16"
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
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" href="/legal/cookies#preferences">
            Customize
          </Button>
          <Button
            variant="secondary"
            className="min-w-[156px]"
            onClick={() => writeConsent({ analytics: false, marketing: false })}
          >
            Reject all
          </Button>
          <Button
            variant="primary"
            onClick={() => writeConsent({ analytics: true, marketing: true })}
          >
            Accept all
          </Button>
        </div>
      </section>
    </div>
  );
}

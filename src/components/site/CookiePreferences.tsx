"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { writeConsent, type Consent } from "@/lib/consent";

const ROW = "flex items-center gap-6 px-6 py-5";
const ROW_TITLE = "text-label-strong uppercase text-white";

/** Preferences panel of the Cookie policy page (Figma 4465:3290, "Your preferences"). */
export function CookiePreferences({ initial }: { initial: Consent | null }) {
  const [choice, setChoice] = useState<Consent>(
    initial ?? { analytics: false, marketing: false },
  );
  const [saved, setSaved] = useState(initial !== null);

  function save(next: Consent) {
    setChoice(next);
    writeConsent(next);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border-subtle bg-surface-1">
        <div className={ROW}>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className={ROW_TITLE}>Strictly necessary</p>
            <p className="text-body-sm text-soft-white">
              Sign-in, security, payment fraud prevention and your cookie
              choices. The site can&apos;t work without them.
            </p>
          </div>
          <p className="text-label-strong uppercase text-success">Always on</p>
        </div>
        <div className={`${ROW} border-t border-border-subtle`}>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className={ROW_TITLE}>Analytics</p>
            <p className="text-body-sm text-soft-white">
              Anonymous audience measurement to see which pages and features
              help artists most.
            </p>
          </div>
          <Switch
            label="Analytics"
            hideLabel
            checked={choice.analytics}
            onChange={(v) => setChoice({ ...choice, analytics: v })}
          />
        </div>
        <div className={`${ROW} border-t border-border-subtle`}>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className={ROW_TITLE}>Marketing</p>
            <p className="text-body-sm text-soft-white">
              Measure our ads on social networks and show you relevant
              ReachRadar campaigns.
            </p>
          </div>
          <Switch
            label="Marketing"
            hideLabel
            checked={choice.marketing}
            onChange={(v) => setChoice({ ...choice, marketing: v })}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-surface-2 px-6 py-5">
          <Button
            variant="secondary"
            onClick={() => save({ analytics: false, marketing: false })}
          >
            Reject all
          </Button>
          <Button
            variant="secondary"
            onClick={() => save({ analytics: true, marketing: true })}
          >
            Accept all
          </Button>
          <span className="hidden flex-1 sm:block" />
          <Button variant="primary" onClick={() => save(choice)}>
            Save my choices
          </Button>
        </div>
      </div>
      <p
        role="status"
        className="flex items-center gap-2 text-body-sm text-soft-white"
      >
        <Check
          size={14}
          strokeWidth={1.5}
          className={saved ? "text-success" : "invisible"}
          aria-hidden
        />
        <span className={saved ? undefined : "invisible"}>
          Your choices are saved for 6 months. We&apos;ll ask again after that.
        </span>
      </p>
    </div>
  );
}

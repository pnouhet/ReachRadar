import { Check } from "lucide-react";
import { LABEL } from "@/components/home/parts";
import { Button } from "@/components/ui/Button";
import type { Pack } from "@/content/pricing";
import { cn } from "@/lib/cn";

/** One credit pack. The popular one gets the cyan border and the "Most popular" tab. */
export function PackCard({ pack, href }: { pack: Pack; href: string }) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-5 rounded-xs p-7",
        pack.popular
          ? "border-[1.5px] border-cyan bg-surface-2"
          : "border border-border-subtle bg-surface-1",
      )}
    >
      {pack.popular && (
        <span
          className={cn(
            LABEL,
            "slant absolute top-[-12px] left-[26.5px] inline-flex h-7 items-center px-4 text-midnight [--slant-bg:#fff] [--slant-border:#fff] [--slant-h:28px]",
          )}
        >
          Most popular
        </span>
      )}

      <div className="flex min-h-[22px] items-center justify-between">
        <h3 className={cn(LABEL, "text-cyan")}>{pack.name}</h3>
        {pack.save && (
          <p className={cn(LABEL, "px-2 text-success")}>Save {pack.save}%</p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="flex items-baseline gap-2.5">
          <span className="font-display text-[52px] leading-[56px] font-extrabold">
            {pack.credits}
          </span>
          <span className="text-body-md">credits</span>
        </p>
        <p className="text-body-sm text-muted">≈ {pack.pitches} pitches</p>
      </div>

      <p className="flex flex-wrap items-baseline gap-x-2.5">
        <span className="font-display text-[48px] leading-[52px] font-bold">
          €{pack.price}
        </span>
        <span className="text-body-sm text-soft-white">
          €{pack.perCredit} per credit
        </span>
      </p>

      <hr className="h-px border-0 bg-border-subtle" />

      <ul className="flex flex-col gap-3 pb-4">
        {pack.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-body-md">
            <Check
              size={16}
              strokeWidth={2}
              className="mt-1 flex-none text-cyan"
              aria-hidden
            />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        href={href}
        variant={pack.popular ? "primary" : "secondary"}
        className="mt-auto self-center"
      >
        Buy {pack.credits} credits
      </Button>
    </article>
  );
}

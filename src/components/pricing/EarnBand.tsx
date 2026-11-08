import { Coins, Headphones, Star } from "lucide-react";
import { CONTAINER, LABEL } from "@/components/site/layout";
import { Button } from "@/components/ui/Button";
import { PRICING } from "@/content/pricing";
import { cn } from "@/lib/cn";

const { earn } = PRICING;

const ICONS = { headphones: Headphones, star: Star, coins: Coins } as const;

/** "Or earn them for free": the Rate & Earn band with its (presentational) progress bar. */
export function EarnBand() {
  return (
    <section
      aria-labelledby="earn-title"
      className={cn(CONTAINER, "pt-24 max-[860px]:pt-16")}
    >
      <div
        className="flex items-center gap-16 rounded-xs border border-cyan p-14 max-[1100px]:flex-col max-[1100px]:items-stretch max-[1100px]:gap-10 max-[560px]:p-6"
        style={{
          backgroundImage:
            "linear-gradient(161.87deg, rgba(5,155,192,0.22) 0%, #122338 100%)",
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
          <p className={cn(LABEL, "text-cyan")}>{earn.label}</p>
          <h2
            id="earn-title"
            className="text-heading-secondary text-[length:clamp(30px,4vw,48px)]"
          >
            {earn.title}
          </h2>
          <p className="text-body-lg text-soft-white">{earn.text}</p>

          <div className="flex w-full flex-col gap-2.5 pt-2">
            <div aria-hidden className="flex gap-1.5">
              {Array.from({ length: earn.segments }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "slant h-3 min-w-0 flex-1 [--slant-border-width:1px] [--slant-h:12px]",
                    i < earn.rated
                      ? "[--slant-bg:var(--color-cyan)] [--slant-border:var(--color-cyan)]"
                      : "[--slant-border:var(--color-border-strong)]",
                  )}
                />
              ))}
            </div>
            <div className={cn(LABEL, "flex justify-between gap-4")}>
              <p>{earn.progress}</p>
              <p className="text-cyan">{earn.reward}</p>
            </div>
          </div>

          <Button href={earn.cta.href}>{earn.cta.label}</Button>
        </div>

        <ol className="flex w-[420px] flex-none flex-col max-[1100px]:w-full">
          {earn.steps.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <li
                key={step.title}
                className={cn(
                  "flex items-start gap-[18px] py-[18px]",
                  i > 0 && "border-t border-border-subtle",
                )}
              >
                <span className="flex size-12 flex-none items-center justify-center text-cyan">
                  <Icon size={22} strokeWidth={1.5} aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="text-heading-card uppercase">{step.title}</h3>
                  <p className="text-body-md text-soft-white">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

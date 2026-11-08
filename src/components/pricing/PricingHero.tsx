import Image from "next/image";
import { ListMusic, Newspaper, Radio, ShieldCheck } from "lucide-react";
import { CONTAINER, LABEL } from "@/components/site/layout";
import { cn } from "@/lib/cn";
import { PRICING } from "@/content/pricing";

const { hero, how, costs } = PRICING;

const ICONS = {
  newspaper: Newspaper,
  "list-music": ListMusic,
  radio: Radio,
  "shield-check": ShieldCheck,
} as const;

/** Hero ("Buy credits") + "How credits work" tiles, over the shared concert photo. */
export function PricingHero() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-34.67%] left-[-2.08%] h-[166.28%] w-[104.17%]">
          <Image
            src={hero.photo}
            alt=""
            fill
            preload
            sizes="105vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(13,27,42,0) 25%, #0d1b2a 100%), linear-gradient(180deg, #0d1b2a 0%, rgba(13,27,42,0) 10%, #0d1b2a 64.891%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(31,56,84,0) 65.176%, #0d1b2a 100%), url(${hero.dots})`,
          }}
        />
      </div>

      <div
        className={cn(
          CONTAINER,
          "relative flex flex-col items-center pt-[279px] pb-[110px] max-[860px]:pt-[150px] max-[860px]:pb-16",
        )}
      >
        <section
          aria-labelledby="pricing-title"
          className="flex flex-col items-center gap-5 text-center"
        >
          <p className={cn(LABEL, "flex flex-wrap justify-center gap-x-2.5")}>
            <span className="text-cyan">{hero.eyebrow[0]}</span>
            <span aria-hidden className="text-muted">
              ·
            </span>
            <span>{hero.eyebrow[1]}</span>
          </p>
          <h1
            id="pricing-title"
            className="text-gradient font-display text-[clamp(40px,5vw,60px)] leading-[1.0667] font-extrabold uppercase"
          >
            {hero.title}
          </h1>
          <p className="max-w-[720px] text-body-lg text-soft-white">
            {hero.lead}
          </p>
        </section>

        <section
          aria-labelledby="how-title"
          className="mt-32 flex w-full flex-col gap-16 max-[860px]:mt-16 max-[860px]:gap-10"
        >
          <header className="flex flex-col items-center gap-3.5 text-center">
            <p className={cn(LABEL, "text-cyan")}>{how.label}</p>
            <h2
              id="how-title"
              className="text-heading-secondary text-[length:clamp(30px,4vw,48px)] [font-feature-settings:'case'_1,'lnum'_1,'pnum'_1]"
            >
              {how.title}
            </h2>
            <p className="text-body-md text-soft-white">{how.text}</p>
          </header>

          <ul className="grid grid-cols-4 rounded-xs max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
            {costs.map((cost) => {
              const Icon = ICONS[cost.icon];
              const free = cost.credits === 0;
              return (
                <li
                  key={cost.text}
                  className={cn(
                    "flex flex-col items-center gap-2.5 border-r border-border-strong px-6 py-7 text-center last:border-r-0",
                    "max-[860px]:nth-[2n]:border-r-0 max-[860px]:border-b max-[860px]:nth-[n+3]:border-b-0",
                    "max-[560px]:border-r-0 max-[560px]:border-b max-[560px]:nth-[n+3]:border-b max-[560px]:last:border-b-0",
                  )}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-cyan"
                    aria-hidden
                  />
                  <p className="flex items-baseline gap-2 whitespace-nowrap">
                    <span
                      className={cn(
                        "font-display text-[44px] leading-[48px] font-extrabold",
                        free ? "text-success" : "text-rose",
                      )}
                    >
                      {cost.credits}
                    </span>
                    <span className="text-body-md text-soft-white">
                      {cost.unit}
                    </span>
                  </p>
                  <p className="text-body-sm text-soft-white">{cost.text}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

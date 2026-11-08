import type { Metadata } from "next";
import { ArrowUpRight, Check, Coins, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CONTAINER, LABEL } from "@/components/site/layout";
import { EarnBand } from "@/components/pricing/EarnBand";
import { Faq } from "@/components/pricing/Faq";
import { PackCard } from "@/components/pricing/PackCard";
import { PaymentMethods } from "@/components/pricing/PaymentMethods";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PRICING } from "@/content/pricing";
import { getViewer } from "@/lib/auth/session";
import { cn } from "@/lib/cn";
import { buyCreditsHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buy credits",
  description: PRICING.meta.description,
};

const { packsIntro, packs, assurance, faqIntro, faq } = PRICING;

/** Pricing (Figma 06): packs, how credits work, free credits, FAQ and payment methods. */
export default async function PricingPage() {
  const buyHref = buyCreditsHref(await getViewer());

  return (
    <main className="overflow-x-clip [font-feature-settings:'lnum'_1,'pnum'_1] [--gutter:60px] max-[1280px]:[--gutter:40px] max-[860px]:[--gutter:24px]">
      <PricingHero />

      <section
        aria-labelledby="packs-title"
        className={cn(CONTAINER, "flex flex-col gap-10 pt-24 max-[860px]:pt-4")}
      >
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2.5">
            <h2
              id="packs-title"
              className="text-heading-secondary text-[length:clamp(30px,4vw,48px)]"
            >
              {packsIntro.title}
            </h2>
            <p className="text-body-md text-soft-white">{packsIntro.text}</p>
          </div>
          <p className={cn(LABEL, "flex items-center gap-2 text-cyan")}>
            <Coins size={16} strokeWidth={1.5} aria-hidden />
            {packsIntro.newHere}
          </p>
        </header>

        <div className="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
          {packs.map((pack) => (
            <PackCard key={pack.name} pack={pack} href={buyHref} />
          ))}
        </div>

        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {assurance.map((item) => (
            <li
              key={item.text}
              className="flex items-center gap-2 text-body-sm text-soft-white"
            >
              <AssuranceIcon name={item.icon} />
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <EarnBand />

      <section
        aria-labelledby="faq-title"
        className={cn(
          CONTAINER,
          "flex items-start gap-24 pt-32 max-[1280px]:gap-14 max-[1100px]:flex-col max-[1100px]:items-stretch max-[860px]:pt-16",
        )}
      >
        <div className="flex w-[380px] flex-none flex-col items-start gap-4 max-[1100px]:w-auto">
          <p className={cn(LABEL, "text-cyan")}>{faqIntro.label}</p>
          <h2
            id="faq-title"
            className="text-heading-secondary text-[length:clamp(30px,4vw,48px)]"
          >
            {faqIntro.title}
          </h2>
          <p className="text-body-md text-soft-white">{faqIntro.text}</p>
          <Link
            href={faqIntro.contact.href}
            className={cn(
              LABEL,
              "inline-flex items-center gap-1.5 text-cyan hover:underline",
            )}
          >
            {faqIntro.contact.label}
            <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
        <Faq items={faq} />
      </section>

      <PaymentMethods />
    </main>
  );
}

const ASSURANCE_ICONS = {
  "shield-check": ShieldCheck,
  coins: Coins,
  check: Check,
} as const;

function AssuranceIcon({ name }: { name: keyof typeof ASSURANCE_ICONS }) {
  const Icon = ASSURANCE_ICONS[name];
  return <Icon size={16} strokeWidth={1.5} className="flex-none" aria-hidden />;
}

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { HOME } from "@/content/home";
import {
  Benefits,
  GRADIENT_TITLE,
  SECTION,
  SPLIT,
  SPLIT_CARD,
  SPLIT_COPY,
} from "./parts";
import { CONTAINER, LABEL } from "@/components/site/layout";

const { preTest } = HOME;
const { card } = preTest;

/** Illustration of the readiness report (inert, except "See matches"). */
function ScoreCard() {
  return (
    <div data-anim="card" className={`${SPLIT_CARD} flex-[0_0_612px] p-1`}>
      <div data-anim="score-card" className="flex flex-col gap-4 p-6">
        {/* Figma trims the text boxes to the cap height: 13px row, 21px status label. */}
        <div className="flex h-[13px] items-center gap-3 max-[560px]:h-auto">
          <h3 className="flex-1 text-heading-card leading-[13px] uppercase max-[560px]:leading-6 lining-nums proportional-nums">
            {card.title}
          </h3>
          <span className={`${LABEL} text-cyan`}>{card.tag}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xs border border-border-strong bg-surface-2 px-3.5 py-2.5 text-body-sm">
          <span className="flex-1">{card.track}</span>
          <ChevronDown size={16} strokeWidth={2} aria-hidden />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span
            data-anim="score-status"
            className={`${LABEL} px-2.5 py-1.5 leading-[9px] text-success`}
          >
            {card.status}
          </span>
          <div className="flex items-center gap-3">
            <span
              data-anim="count"
              data-count={card.score}
              className="font-display text-[72px] leading-[72px] font-extrabold lining-nums proportional-nums"
            >
              {String(card.score)}
            </span>
            <span className="text-muted">{card.max}</span>
          </div>
        </div>
        <p className="text-body-sm text-muted">{card.progress}</p>
        <div className="flex flex-col gap-4">
          {card.criteria.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="w-24 flex-none text-body-sm text-soft-white max-[560px]:w-20">
                {c.name}
              </span>
              <Image
                data-anim="criterion-bar"
                src={c.bar}
                width={196}
                height={10}
                alt=""
                unoptimized
                className="h-2.5 w-[196px] flex-none max-[560px]:w-[120px]"
              />
              <span className="flex-1" />
              <span data-anim="criterion-value" className={LABEL}>
                {c.value}
              </span>
            </div>
          ))}
        </div>
        <div
          data-anim="highlight"
          className="flex flex-col gap-1.5 bg-surface-3 py-2.5 pr-2.5 pl-3.5 text-body-sm"
        >
          <p>{card.quote}</p>
          <p className="text-muted">{card.quoteMeta}</p>
        </div>
      </div>
      <div
        data-anim="score-foot"
        className="flex items-center gap-3 border-t border-border-subtle px-6 py-[18px] text-body-sm"
      >
        <p className="flex-1">{card.unlocked}</p>
        <Link
          href={card.matches.href}
          className={`${LABEL} text-cyan hover:underline`}
        >
          {card.matches.label}
        </Link>
      </div>
    </div>
  );
}

/** 04 · Test before you pitch. */
export function PreTest() {
  return (
    <section aria-labelledby="pretest-title" className={SECTION}>
      <div className={`${CONTAINER} ${SPLIT}`}>
        <div className={SPLIT_COPY}>
          <span data-anim="badge" className="inline-flex">
            <SectionBadge>{preTest.badge}</SectionBadge>
          </span>
          <h2 id="pretest-title" data-anim="title" className={GRADIENT_TITLE}>
            {preTest.title}
          </h2>
          <p data-anim="up" className="text-body-lg text-soft-white">
            {preTest.text}
          </p>
          <Benefits items={preTest.benefits} />
          <span data-anim="up" className="inline-flex">
            <Button variant="secondary" href={preTest.cta.href}>
              {preTest.cta.label}
            </Button>
          </span>
        </div>
        <ScoreCard />
      </div>
    </section>
  );
}

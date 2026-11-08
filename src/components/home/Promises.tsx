import { Headphones, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { HOME } from "@/content/home";
import { GRADIENT_TITLE, SECTION } from "./parts";
import { CONTAINER } from "@/components/site/layout";

const { promisesHead: head, promises } = HOME;

const ICONS = {
  "shield-check": ShieldCheck,
  headphones: Headphones,
  "trending-up": TrendingUp,
} as const;

/** 02 · Three promises. */
export function Promises() {
  return (
    <section aria-labelledby="promises-title" className={SECTION}>
      <div className={CONTAINER}>
        <header className="flex flex-col items-center gap-8 text-center">
          <span data-anim="badge" className="inline-flex">
            <SectionBadge>{head.badge}</SectionBadge>
          </span>
          <h2 id="promises-title" data-anim="title" className={GRADIENT_TITLE}>
            {head.title}
          </h2>
          <p data-anim="up" className="text-body-lg text-muted">
            {head.sub}
          </p>
        </header>
        <ol
          data-anim="steps"
          className="mt-16 grid grid-cols-3 gap-12 max-[860px]:grid-cols-1"
        >
          {promises.map((p) => {
            const Icon = ICONS[p.icon];
            return (
              <li
                key={p.num}
                data-anim="step"
                className="flex flex-col items-center gap-3 pt-8"
              >
                <Icon
                  data-anim="step-icon"
                  size={32}
                  strokeWidth={2}
                  absoluteStrokeWidth
                  className="text-cyan"
                  aria-hidden
                />
                <span
                  data-anim="step-num"
                  aria-hidden
                  className="mb-3 py-1 font-display text-[72px] leading-16 font-extrabold text-outline lining-nums"
                >
                  {p.num}
                </span>
                <h3 className="mb-3 self-stretch text-heading-h3 uppercase">
                  {p.title}
                </h3>
                <p className="self-stretch text-soft-white">{p.text}</p>
              </li>
            );
          })}
        </ol>
        <div data-anim="up" className="mt-16 flex justify-center">
          <Button href={head.cta.href}>{head.cta.label}</Button>
        </div>
      </div>
    </section>
  );
}

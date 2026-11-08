import Image from "next/image";
import { HOME } from "@/content/home";
import { SECTION, ToneAvatar } from "./parts";
import { CONTAINER, LABEL } from "@/components/site/layout";

const { testimonialsHead: head, testimonials } = HOME;

/** Artists who got heard — three quote cards (anchor #stories). */
export function Testimonials() {
  return (
    <section id={head.id} aria-labelledby="quotes-title" className={SECTION}>
      <div className={CONTAINER}>
        <header className="flex flex-col items-center gap-6 text-center">
          <Image
            data-anim="quote-mark"
            src={head.quoteMark}
            width={48}
            height={36}
            alt=""
            unoptimized
          />
          <h2
            id="quotes-title"
            data-anim="title"
            className="font-display text-[length:clamp(30px,4vw,48px)] leading-[1.0833] font-bold text-soft-white uppercase"
          >
            {head.title}
          </h2>
        </header>
        <div
          data-anim="quotes"
          className="mt-16 grid grid-cols-3 gap-8 max-[860px]:grid-cols-1"
        >
          {testimonials.map((t) => (
            // The reveal (GSAP transform) and the hover (CSS transform transition) sit on two elements.
            <div key={t.name} data-anim="quote" className="flex">
              <figure className="flex min-h-[306px] flex-1 flex-col justify-between gap-6 rounded-xs border border-border-subtle bg-surface-1 p-8 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:-skew-x-3 hover:border-border-strong">
                <p className={`${LABEL} text-cyan`}>{t.result}</p>
                <blockquote className="text-body-lg">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3.5">
                  <ToneAvatar initials={t.initials} tone={t.tone} aria-hidden />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-heading-card uppercase lining-nums proportional-nums">
                      {t.name}
                    </span>
                    <span className="text-body-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

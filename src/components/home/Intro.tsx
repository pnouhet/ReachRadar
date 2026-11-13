import { SectionBadge } from "@/components/ui/SectionBadge";
import { HOME } from "@/content/home";
import { CONTAINER } from "@/components/site/layout";

const { intro, stats } = HOME;

/** 01 · Get heard by new fans — sits on the hero photo, which fades to midnight. */
export function Intro() {
  return (
    <section
      id={intro.id}
      aria-labelledby="intro-title"
      // Focus target for the hero "Scroll down" link (keyboard users continue from here).
      tabIndex={-1}
      className="relative flex min-h-[700px] scroll-mt-20 items-center outline-none bg-linear-to-b from-midnight/0 from-0% to-midnight to-[40.1%] py-[106px] max-[860px]:py-16"
    >
      <div className={`${CONTAINER} flex flex-col items-center gap-12`}>
        <span data-anim="badge" className="inline-flex">
          <SectionBadge>{intro.badge}</SectionBadge>
        </span>
        <div className="flex flex-col items-center gap-8">
          <h2
            id="intro-title"
            data-anim="title"
            className="text-gradient text-center font-display text-[length:clamp(34px,5vw,60px)] leading-[1.2] font-extrabold uppercase"
          >
            {intro.title}
          </h2>
          <p
            data-anim="up"
            className="text-justify text-body-lg text-[#ddd] max-[560px]:text-left"
          >
            {intro.text}
          </p>
        </div>
        <dl
          data-anim="stats"
          className="flex flex-wrap items-end justify-center gap-x-20 gap-y-8"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-anim="stat"
              className="flex flex-col-reverse items-center gap-[25px] text-center"
            >
              <dt
                className={`font-bold text-soft-white uppercase ${i === stats.length - 1 ? "text-[16px]" : "text-[15px]"}`}
              >
                {s.label}
              </dt>
              <dd className="text-metric-lg text-rose lining-nums proportional-nums">
                <span
                  data-anim="count"
                  data-count={s.value}
                  data-prefix={s.prefix}
                  data-suffix={s.suffix}
                >
                  {`${s.prefix}${s.value}${s.suffix}`}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

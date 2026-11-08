import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { Lines, SECTION } from "./parts";

const { final } = HOME;

/** Closing band on the concert photo: "Your next fans are listening". */
export function FinalCta() {
  return (
    <section
      data-anim="final"
      aria-labelledby="final-title"
      className={SECTION}
    >
      <div
        data-anim="final-band"
        className="relative flex min-h-[680px] flex-col items-center justify-center gap-8 overflow-hidden px-(--gutter) py-20 text-center"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            data-anim="final-photo"
            className="absolute top-[-42.86%] left-0 h-[238.1%] w-full"
          >
            <Image
              src={final.photo}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, var(--color-midnight) 0%, rgb(13 27 42 / 0) 30%, rgb(13 27 42 / 0) 70%, var(--color-midnight) 100%), url(${final.dots}) top left / 186px 186px, rgb(13 27 42 / 0.55)`,
            }}
          />
        </div>
        <h2
          id="final-title"
          data-anim="final-title"
          className="text-gradient relative font-display text-[length:clamp(40px,6vw,72px)] leading-[1.0556] font-extrabold uppercase"
        >
          <Lines lines={final.title} />
        </h2>
        <p
          data-anim="final-text"
          className="relative text-body-lg text-soft-white"
        >
          {final.text}
        </p>
        <div className="relative flex flex-wrap justify-center gap-6">
          <span data-anim="final-btn" className="inline-flex">
            <Button href={final.primary.href}>{final.primary.label}</Button>
          </span>
          <span data-anim="final-btn" className="inline-flex">
            <Button variant="secondary" href={final.secondary.href}>
              {final.secondary.label}
            </Button>
          </span>
        </div>
      </div>
    </section>
  );
}

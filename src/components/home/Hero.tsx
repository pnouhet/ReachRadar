import Image from "next/image";
import type { ReactNode } from "react";
import { SocialIcons } from "@/components/site/SocialIcons";
import { Button } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { Lines } from "./parts";

const { hero } = HOME;

function TitleLine({ outline = false }: { outline?: boolean }) {
  return (
    <span
      aria-hidden
      data-anim={outline ? "hero-outline" : "hero-solid"}
      className={outline ? "block text-outline" : "block text-white"}
    >
      {Array.from(hero.title.toUpperCase()).map((char, i) => (
        <span key={i} data-char className="inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}

/** Hero + the 01 intro (passed as children) share the concert photo backdrop. */
export function Hero({ children }: { children: ReactNode }) {
  return (
    <div data-anim="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full max-h-[1724px]"
      >
        <Image
          data-anim="hero-photo"
          src={hero.photo}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-b from-midnight/0 to-midnight" />
        <div
          data-anim="hero-dots"
          className="absolute inset-0"
          style={{ backgroundImage: `url(${hero.dots})` }}
        />
      </div>

      <section
        data-anim="hero"
        aria-labelledby="hero-title"
        className="relative flex min-h-[clamp(720px,100vh,1024px)] flex-col items-center justify-center px-(--gutter) pt-[140px] pb-[200px] text-center min-[861px]:pb-[max(33px,925px_-_clamp(720px,100vh,1024px))]"
      >
        <h1
          id="hero-title"
          data-anim="hero-title"
          className="mb-[52px] flex flex-col font-display text-[length:min(90px,(100vw_-_2*var(--gutter))/12.2)] leading-[0.755] font-extrabold whitespace-nowrap"
        >
          <span className="sr-only">{hero.title}</span>
          <TitleLine />
          <TitleLine outline />
        </h1>
        <div data-anim="hero-cta" className="flex flex-col items-center gap-8">
          <p data-anim="hero-lead" className="text-body-lg text-soft-white">
            <Lines lines={hero.lead} brClassName="max-[860px]:hidden" />
          </p>
          <div
            data-anim="hero-btns"
            className="flex flex-wrap justify-center gap-6 py-0.5"
          >
            <span data-anim="hero-btn" className="inline-flex">
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
            </span>
            <span data-anim="hero-btn" className="inline-flex">
              <Button variant="secondary" href={hero.secondary.href}>
                {hero.secondary.label}
              </Button>
            </span>
          </div>
        </div>
        <div
          data-anim="hero-bar"
          className="absolute bottom-[102px] left-1/2 flex h-[100px] w-[min(1320px,100%_-_2*var(--gutter))] -translate-x-1/2 items-center justify-between max-[860px]:bottom-10"
        >
          <a
            href="#get-heard"
            aria-label={hero.scroll.label}
            className="flex items-center gap-5 text-[16px] leading-[30px]"
          >
            <Image
              src={hero.scroll.icon}
              width={24}
              height={24}
              alt=""
              unoptimized
              className="animate-nudge motion-reduce:animate-none"
            />
            <span className="max-[560px]:hidden">{hero.scroll.label}</span>
          </a>
          <SocialIcons spacing="hero" />
        </div>
      </section>

      {children}
    </div>
  );
}

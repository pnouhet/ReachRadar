import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { HOME } from "@/content/home";
import { GRADIENT_TITLE, Lines, SECTION } from "./parts";
import { CONTAINER } from "@/components/site/layout";

const { categoriesHead: head, categories } = HOME;

/** Slanted photo slot of a category card (the PNG carries the parallelogram shape). */
const PHOTO_BOX =
  "absolute top-[1.925%] left-0 h-[98.075%] w-[99.8%] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1.5";

/** 03 · Pitch to the right ears — four curator categories. */
export function Categories() {
  return (
    <section aria-labelledby="ears-title" className={SECTION}>
      <div className={CONTAINER}>
        <header className="flex flex-col items-center gap-8 text-center">
          <span data-anim="badge" className="inline-flex">
            <SectionBadge>{head.badge}</SectionBadge>
          </span>
          <h2 id="ears-title" data-anim="title" className={GRADIENT_TITLE}>
            <Lines lines={head.title} />
          </h2>
          <p data-anim="up" className="text-body-lg text-muted">
            {head.sub}
          </p>
        </header>
        <div
          data-anim="categories"
          className="mt-16 grid grid-cols-4 gap-8 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1"
        >
          {categories.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              data-anim="cat"
              className="group flex flex-col gap-5"
            >
              <div className="relative aspect-[306/360]">
                <div data-anim="cat-img" className={PHOTO_BOX}>
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 306px"
                  />
                </div>
                <Image
                  src={head.fade}
                  alt=""
                  width={305}
                  height={353}
                  unoptimized
                  className={`${PHOTO_BOX} max-w-none`}
                />
                <Image
                  data-anim="cat-badge"
                  src={c.badge}
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="absolute top-[78.9%] left-5 size-12"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-heading-card uppercase">{c.title}</h3>
                <ArrowUpRight
                  size={24}
                  strokeWidth={2}
                  className="text-cyan transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                  aria-hidden
                />
              </div>
              <p className="text-body-sm text-muted">{c.meta}</p>
            </Link>
          ))}
        </div>
        <div data-anim="up" className="mt-16 flex justify-center">
          <Button variant="secondary" href={head.cta.href}>
            {head.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

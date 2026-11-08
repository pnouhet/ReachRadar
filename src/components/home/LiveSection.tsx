import Image from "next/image";
import { HOME } from "@/content/home";
import { LiveTabs } from "./LiveTabs";
import { Lines } from "./parts";
import { CONTAINER } from "@/components/site/layout";

const { live } = HOME;

/** "Go ahead, live from your music !" — quote on the left, concert photo with tabs on the right. */
export function LiveSection() {
  return (
    <section
      data-anim="live"
      aria-labelledby="live-title"
      className="flex min-h-[1052px] items-center py-[120px] max-[860px]:min-h-0 max-[860px]:py-16"
    >
      <div
        className={`${CONTAINER} flex items-center max-[1100px]:flex-col max-[1100px]:gap-14`}
      >
        <div className="relative flex flex-[0_1_733px] items-center justify-center self-stretch p-6 max-[1100px]:w-full max-[1100px]:flex-none max-[1100px]:pt-16">
          <Image
            data-anim="live-quote"
            src={live.quoteMark}
            width={44}
            height={44}
            alt=""
            unoptimized
            className="absolute top-0 left-0"
          />
          <div className="flex flex-col items-center gap-6 text-center">
            <h2
              id="live-title"
              data-anim="title"
              className="font-display text-[length:clamp(32px,3.5vw,48.24px)] leading-[1.0773] font-bold text-[#dbdbdc] uppercase"
            >
              <Lines lines={live.title} />
            </h2>
            <p
              data-anim="up"
              className="text-[19.04px] leading-[27.6px] text-[#ddd]"
            >
              <Lines lines={live.text} brClassName="max-[860px]:hidden" />
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_587px] flex-col gap-4 max-[1100px]:w-[min(587px,100%)] max-[1100px]:flex-none">
          <LiveTabs tabs={live.tabs}>
            <Image
              data-anim="live-img"
              src={live.image.src}
              width={live.image.width}
              height={live.image.height}
              alt={live.image.alt}
              sizes="(max-width: 1100px) 100vw, 587px"
              className="aspect-[587/500] h-auto w-full object-cover"
            />
          </LiveTabs>
        </div>
      </div>
    </section>
  );
}

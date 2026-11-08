import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { HOME } from "@/content/home";
import { cn } from "@/lib/cn";
import {
  Benefits,
  FAKE_PRIMARY,
  GRADIENT_TITLE,
  Lines,
  SECTION,
  SPLIT,
  SPLIT_CARD,
  SPLIT_COPY,
} from "./parts";
import { CONTAINER, LABEL } from "@/components/site/layout";
import { Waveform } from "./Waveform";

const { rateEarn } = HOME;
const { player, progress } = rateEarn;

/** Illustration of the anonymous rating queue (inert, except the play button). */
function Player() {
  return (
    <div
      data-anim="card"
      className={`${SPLIT_CARD} flex flex-[0_0_614px] flex-col gap-6 p-8 max-[1100px]:order-1 max-[560px]:p-5`}
    >
      <div className="flex justify-between gap-3">
        <span className={`${LABEL} text-muted`}>{player.track}</span>
        <span className={`${LABEL} text-cyan`}>{player.position}</span>
      </div>
      <div data-anim="chips" className="flex flex-wrap gap-3">
        {player.chips.map((chip, i) => (
          <Chip key={chip} active={i === 0}>
            {chip}
          </Chip>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Waveform
          heights={rateEarn.waveform}
          played={rateEarn.played}
          playIcon={player.playIcon}
          label={player.playLabel}
        />
        <div className="flex justify-between text-body-sm text-muted">
          <span>{player.elapsed}</span>
          <span>{player.duration}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={LABEL}>{player.ratingLabel}</span>
        <Image
          data-anim="rating"
          src={player.rating.src}
          width={245}
          height={19}
          alt={player.rating.alt}
          unoptimized
          className="h-auto max-[560px]:w-[180px]"
        />
      </div>
      <div
        data-anim="feedback"
        className="flex flex-col gap-2 border border-cyan bg-surface-2 px-4 py-3.5"
      >
        <p>{player.feedback}</p>
        <p className="text-right text-body-sm text-cyan">
          {player.feedbackCount}
        </p>
      </div>
      <div
        data-anim="player-actions"
        className="flex items-center justify-between"
      >
        <span className="px-1 py-3.5 text-button">{player.skip}</span>
        <span className={FAKE_PRIMARY}>{player.submit}</span>
      </div>
    </div>
  );
}

/** 05 · Rate & earn. */
export function RateEarn() {
  return (
    <section
      aria-labelledby="rate-title"
      className={`${SECTION} pb-(--section-gap)`}
    >
      <div className={`${CONTAINER} ${SPLIT}`}>
        <Player />
        <div className={SPLIT_COPY}>
          <span data-anim="badge" className="inline-flex">
            <SectionBadge>{rateEarn.badge}</SectionBadge>
          </span>
          <h2 id="rate-title" data-anim="title" className={GRADIENT_TITLE}>
            <Lines lines={rateEarn.title} />
          </h2>
          <p data-anim="up" className="text-body-lg text-soft-white">
            {rateEarn.text}
          </p>
          <Benefits items={rateEarn.benefits} />
          <div
            data-anim="progress"
            className="flex flex-col gap-4 self-stretch bg-surface-2 p-6"
          >
            <div className="flex justify-between gap-3">
              <span className={LABEL}>{progress.label}</span>
              <span className={`${LABEL} text-cyan`}>{progress.reward}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: progress.total }, (_, i) => (
                <span
                  key={i}
                  data-anim="segment"
                  className={cn(
                    "h-2 flex-[1_1_0]",
                    i < progress.done ? "bg-cyan" : "bg-muted opacity-30",
                  )}
                />
              ))}
            </div>
          </div>
          <span data-anim="up" className="inline-flex">
            <Button href={rateEarn.cta.href}>{rateEarn.cta.label}</Button>
          </span>
        </div>
      </div>
    </section>
  );
}

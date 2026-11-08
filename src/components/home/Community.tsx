import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { HOME } from "@/content/home";
import {
  CONTAINER,
  GRADIENT_TITLE,
  LABEL,
  SECTION,
  SPLIT,
  SPLIT_CARD,
  SPLIT_COPY,
  ToneAvatar,
} from "./parts";

const { community } = HOME;
const { chat } = community;

const BUBBLE = "max-w-[412px] px-4 py-3";

/** Illustration of an artist chat (inert: no live controls). */
function ChatCard() {
  return (
    <div
      data-anim="card"
      className={`${SPLIT_CARD} flex min-h-[554px] flex-[0_0_612px] flex-col gap-5 p-7`}
    >
      <div data-anim="chat-head" className="flex items-center gap-3.5">
        <ToneAvatar initials={chat.initials} tone={chat.tone} size={44} />
        <div className="flex flex-1 flex-col gap-0.5">
          <h3 className="text-heading-card uppercase lining-nums proportional-nums">
            {chat.name}
          </h3>
          <p className="text-body-sm text-muted">{chat.role}</p>
        </div>
        <Image
          src={chat.onlineDot}
          width={10}
          height={10}
          alt={chat.onlineLabel}
          unoptimized
          className="animate-pulse motion-reduce:animate-none"
        />
      </div>
      <div data-anim="chat-rule" className="h-px bg-border-subtle" />
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex">
          <p data-anim="msg-in" className={`${BUBBLE} bg-surface-2`}>
            {chat.first}
          </p>
        </div>
        <div className="flex">
          <div
            data-anim="msg-in"
            className="flex items-center gap-3.5 bg-surface-2 px-3.5 py-3"
          >
            <Image
              src={chat.track.cover}
              width={48}
              height={48}
              alt=""
              className="size-12 object-cover"
            />
            <div className="flex flex-col gap-0.5 whitespace-nowrap max-[560px]:whitespace-normal">
              <p>{chat.track.title}</p>
              <p className="text-body-sm text-muted">{chat.track.meta}</p>
            </div>
            <span
              aria-hidden
              className="flex size-9 flex-none items-center justify-center rounded-full bg-rose"
            >
              <Play size={16} strokeWidth={2} />
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <p data-anim="msg-mine" className={`${BUBBLE} bg-cyan/18`}>
            {chat.reply}
          </p>
        </div>
      </div>
      <div
        data-anim="composer"
        aria-hidden
        className="flex items-center gap-3 border border-border-strong bg-midnight px-4 py-3.5"
      >
        <span className="min-w-0 flex-1 text-muted">{chat.placeholder}</span>
        <span className={`${LABEL} text-cyan`}>{chat.send}</span>
      </div>
    </div>
  );
}

/** 06 · Find your next collab. */
export function Community() {
  return (
    <section aria-labelledby="collab-title" className={SECTION}>
      <div className={`${CONTAINER} ${SPLIT}`}>
        <div className={SPLIT_COPY}>
          <span data-anim="badge" className="inline-flex">
            <SectionBadge>{community.badge}</SectionBadge>
          </span>
          <h2 id="collab-title" data-anim="title" className={GRADIENT_TITLE}>
            {community.title}
          </h2>
          <p data-anim="up" className="text-body-lg text-soft-white">
            {community.text}
          </p>
          <div data-anim="avatars" className="flex items-center">
            {community.avatars.map((a, i) => (
              <ToneAvatar
                key={i}
                aria-hidden
                initials={a.initials}
                tone={a.tone}
                className="-mr-3 border-3 border-midnight"
              />
            ))}
            <span className="ml-7 text-muted">{community.online}</span>
          </div>
          <span data-anim="up" className="inline-flex">
            <Button variant="secondary" href={community.cta.href}>
              {community.cta.label}
            </Button>
          </span>
        </div>
        <ChatCard />
      </div>
    </section>
  );
}

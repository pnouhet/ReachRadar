import Image from "next/image";
import Link from "next/link";
import { Stat } from "@/components/ui/Stat";
import { Wordmark } from "@/components/ui/Wordmark";

export type AuthPanelCopy = { headline: [string, string]; body: [string, string] };

/** Figma Auth Visual Panel (4418:65): concert photo, dot grid, gradient headline and 3 stats. */
export function AuthVisualPanel({ headline, body }: AuthPanelCopy) {
  return (
    <aside className="relative hidden min-h-dvh flex-col justify-between overflow-hidden px-12 pt-12 pb-24 lg:flex xl:px-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/brand/auth-photo.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-[30%_center]"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(13,27,42,0) 75%, rgba(13,27,42,0.9) 100%), linear-gradient(180deg, rgba(13,27,42,0) 35%, rgb(13,27,42) 92%), url(/brand/auth-dots.png), linear-gradient(90deg, rgba(13,27,42,0.35), rgba(13,27,42,0.35))",
            backgroundSize: "auto, auto, 186px 186px, auto",
          }}
        />
      </div>

      <Link href="/" className="relative w-fit" aria-label="ReachRadar home">
        <Wordmark width={400} className="h-5 w-auto max-w-full" />
      </Link>

      <div className="relative flex flex-col gap-8">
        <h2 className="text-display-section text-gradient">
          {headline[0]}
          <br />
          {headline[1]}
        </h2>
        <p className="text-body-lg text-soft-white">
          {body[0]}
          <br />
          {body[1]}
        </p>
        <div className="flex flex-wrap gap-16 pt-4">
          <Stat value="2 180" label="Verified curators" />
          <Stat value="12k" label="Artists" />
          <Stat value="7 days" label="Guaranteed reply" />
        </div>
      </div>
    </aside>
  );
}

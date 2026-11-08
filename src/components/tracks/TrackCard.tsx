import { Star } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TrackCardProps = {
  title: string;
  meta: string;
  coverUrl: string | null;
  status?: string | null;
  rating?: string | null;
  stats?: string;
  play?: ReactNode;
  className?: string;
};

/** Figma Track Card (4426:183): square cover with status tag and play square, Syne title, meta, rating line. */
export function TrackCard({ title, meta, coverUrl, status, rating, stats, play, className }: TrackCardProps) {
  return (
    <article className={cn("flex min-w-0 flex-col gap-3.5", className)}>
      <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-cyan via-surface-3 to-midnight">
        {coverUrl && <Image src={coverUrl} alt="" fill sizes="(min-width: 1280px) 360px, 50vw" className="object-cover" />}
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-transparent from-50% to-midnight/85" />
        {status && (
          <span className="absolute top-4 left-4 bg-midnight px-2.5 py-1.5 text-label-strong text-cyan">{status}</span>
        )}
        {play && <div className="absolute right-4 bottom-4">{play}</div>}
      </div>
      <h3 className="truncate text-heading-card uppercase" title={title}>
        {title}
      </h3>
      {meta && <p className="truncate text-body-sm text-muted">{meta}</p>}
      <div className="flex items-center gap-2 text-body-sm text-muted">
        <Star size={16} className="fill-cyan text-cyan" aria-hidden />
        <span className="text-label-strong text-white">{rating ?? "–"}</span>
        <span className="truncate">{stats}</span>
      </div>
    </article>
  );
}

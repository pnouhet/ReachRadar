import { MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import type { Profile } from "@/lib/profile/queries";

const CURATOR_LABEL = { playlist: "Playlist curator", label: "Label", radio: "Radio", blog: "Blog / media" } as const;

/** 03a header: banner (photo or fallback), overlapping avatar, name, meta, genres, actions. */
export function ProfileHeader({ profile, memberSince, actions }: { profile: Profile; memberSince: string; actions: ReactNode }) {
  const roleLabel = profile.role === "artist" ? "Artist" : profile.curatorType ? CURATOR_LABEL[profile.curatorType] : "Curator";
  return (
    <header className="flex flex-col">
      <div className="relative h-40 w-full overflow-hidden sm:h-[220px]">
        {profile.bannerUrl ? (
          <Image src={profile.bannerUrl} alt="" fill priority sizes="(min-width: 1024px) 1560px, 100vw" className="object-cover" />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-surface-3 via-surface-1 to-midnight"
            style={{ backgroundImage: "url(/brand/dots.png), linear-gradient(120deg, #1f3854, #122338 55%, #0d1b2a)", backgroundSize: "186px 186px, auto" }}
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-transparent from-55% to-midnight" />
        <Link
          href="/settings/profile"
          className="absolute top-4 right-4 flex items-center gap-2 bg-midnight/90 px-3 py-2 text-label-strong text-white hover:text-cyan"
        >
          <Pencil size={14} aria-hidden /> Change cover
        </Link>
      </div>

      <div className="relative flex flex-col gap-6 px-0 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
          <Avatar src={profile.avatarUrl} name={profile.displayName} size={136} className="ring-4 ring-midnight" />
          <div className="flex min-w-0 flex-col gap-3">
            <h1 className="text-[clamp(32px,4.4vw,56px)] leading-[1] font-extrabold break-words uppercase font-display">{profile.displayName}</h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-md text-soft-white">
              <span>{roleLabel}</span>
              {profile.location && (
                <>
                  <span className="text-muted">·</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} strokeWidth={1.5} aria-hidden /> {profile.location}
                  </span>
                </>
              )}
              <span className="text-muted">· Member since {memberSince}</span>
            </p>
            {profile.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.genres.map((g) => (
                  <Chip key={g}>{g}</Chip>
                ))}
              </div>
            )}
            {profile.bio && <p className="max-w-2xl text-body-md text-soft-white">{profile.bio}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">{actions}</div>
      </div>
    </header>
  );
}

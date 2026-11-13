import { Upload } from "lucide-react";
import Link from "next/link";
import { TrackQueue } from "@/components/player/PlayerProvider";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PlayButton } from "@/components/tracks/PlayButton";
import { TrackCard } from "@/components/tracks/TrackCard";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Stat";
import { Tab } from "@/components/ui/Tab";
import { cn } from "@/lib/cn";
import { releaseTag, trackMeta } from "@/lib/format";
import { getCurrentProfile } from "@/lib/profile/queries";
import { deleteDraft } from "@/lib/tracks/actions";
import { getMyTracks } from "@/lib/tracks/queries";
import { artistMock } from "@/mocks";

export const metadata = { title: "My profile" };

export default async function MyProfilePage() {
  const profile = await getCurrentProfile();
  const isArtist = profile.role === "artist";
  const tracks = isArtist ? await getMyTracks(profile.id) : [];
  const memberSince = new Date(profile.createdAt).getUTCFullYear().toString();
  // What the player's Previous / Next walk through: every track that has audio, in list order.
  const playable = tracks
    .filter((t) => t.audioPath)
    .map((t) => ({ id: t.id, title: t.title ?? "draft", artist: profile.displayName, coverUrl: t.coverUrl }));

  return (
    <div className="flex flex-col gap-10">
      <ProfileHeader
        profile={profile}
        memberSince={memberSince}
        actions={
          <>
            <Button variant="ghost" disabled title="Public profiles are coming soon">
              Share profile
            </Button>
            <Button variant="secondary" href="/settings/profile">
              Edit profile
            </Button>
            {isArtist && (
              <Button variant="primary" href="/pitch">
                Pitch a track
              </Button>
            )}
          </>
        }
      />

      {isArtist ? (
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <section className="flex min-w-0 flex-1 flex-col gap-6" aria-label="Tracks">
            <div className="flex gap-2 overflow-x-auto border-b border-border-subtle" role="tablist">
              <Tab active>Tracks ({tracks.length})</Tab>
              <Tab active={false}>Pitch history</Tab>
              <Tab active={false}>Feedback received</Tab>
              <Tab active={false}>About</Tab>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-body-md text-muted">Sorted by latest upload</p>
              <Button variant="secondary" href="/profile/upload">
                Upload a track
              </Button>
            </div>
            <TrackQueue tracks={playable}>
            <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 2xl:grid-cols-3">
              {tracks.map((t) => (
                <li key={t.id} className="min-w-0">
                  <Link href={`/profile/upload?track=${t.id}`} className="sr-only">
                    Edit {t.title ?? "draft"}
                  </Link>
                  <TrackCard
                    title={t.title ?? "Untitled draft"}
                    meta={trackMeta(t)}
                    coverUrl={t.coverUrl}
                    status={t.status === "draft" ? "Draft" : releaseTag(t.releaseStatus, t.releaseDate)}
                    rating={null}
                    stats={t.status === "draft" ? "Finish it to publish" : "Not tested yet"}
                    play={
                      t.audioPath ? (
                        <PlayButton trackId={t.id} title={t.title ?? "draft"} artist={profile.displayName} coverUrl={t.coverUrl} />
                      ) : undefined
                    }
                  />
                  {t.status === "draft" && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <Link href={`/profile/upload?track=${t.id}`} className="text-label-strong text-cyan hover:underline">
                        Continue editing
                      </Link>
                      <form action={deleteDraft.bind(null, t.id)}>
                        <button type="submit" className="text-label-strong text-muted hover:text-rose hover:underline">
                          Delete draft
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/profile/upload"
                  className="flex aspect-square w-full flex-col items-center justify-center gap-3 border border-dashed border-border-strong bg-surface-1/40 p-6 text-center hover:border-slate"
                >
                  <span className="flex size-12 items-center justify-center rounded-full border border-cyan text-cyan">
                    <Upload size={20} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="text-heading-card uppercase">Upload a new track</span>
                  <span className="text-body-sm text-muted">
                    MP3, FLAC or WAV, up to 50 MB.
                    <br />
                    Drag and drop or click to browse.
                  </span>
                </Link>
              </li>
            </ul>
            </TrackQueue>
          </section>

          <aside className="flex w-full flex-col gap-5 xl:w-[400px] xl:shrink-0">
            <DemoCard title="Pitch stats" aside="Last 90 days">
              <div className="grid grid-cols-2 gap-y-6">
                <Stat value={artistMock.pitchStats.pitchesSent} label="Pitches sent" accent="white" />
                <Stat value={artistMock.pitchStats.acceptanceRate} label="Acceptance rate" />
                <Stat value={artistMock.pitchStats.placements} label="Placements" accent="white" />
                <Stat value={artistMock.pitchStats.newListeners} label="New listeners" accent="white" />
              </div>
            </DemoCard>
            <DemoCard title="Recent feedback" aside={<span className="text-label-strong text-cyan">See all</span>}>
              <ul className="flex flex-col divide-y divide-border-subtle">
                {artistMock.recentFeedback.map((f) => (
                  <li key={f.track} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-label-strong">{f.track}</span>
                      <span className="flex gap-1" aria-label={`${f.score} out of 5`}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={cn("h-1 w-3 -skew-x-12", i <= f.score ? "bg-cyan" : "border border-border-strong")} />
                        ))}
                      </span>
                    </div>
                    <p className="text-body-md">“{f.quote}”</p>
                    <p className="text-body-sm text-muted">{f.from}</p>
                  </li>
                ))}
              </ul>
            </DemoCard>
            <section className="flex flex-col gap-4 border border-cyan bg-linear-to-br from-cyan/25 to-surface-1 p-5">
              <p className="text-label-strong text-cyan">Credit balance</p>
              <p className="flex items-baseline gap-3">
                <span className="text-[56px] leading-none font-extrabold font-display">{artistMock.credits.total}</span>
                <span className="text-body-md text-soft-white">credits ~ {Math.floor(artistMock.credits.total / 2)} pitches</span>
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" href="/credits">
                  Buy credits
                </Button>
                <Button variant="secondary" href="/rate">
                  Earn for free
                </Button>
              </div>
            </section>
          </aside>
        </div>
      ) : (
        <p className="text-body-md text-muted">Your playlists, submission guidelines and placements will appear here.</p>
      )}
    </div>
  );
}

function DemoCard({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border border-border-subtle bg-surface-1 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-heading-card uppercase">{title}</h2>
        {typeof aside === "string" ? <span className="text-body-sm text-muted">{aside}</span> : aside}
      </div>
      {children}
    </section>
  );
}

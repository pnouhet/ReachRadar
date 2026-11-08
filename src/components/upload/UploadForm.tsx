"use client";

import { Check, CircleCheck } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { FormMessage } from "@/components/auth/FormMessage";
import { TrackCard } from "@/components/tracks/TrackCard";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/action-state";
import { audioContentType, validateAudioFile } from "@/lib/audio/validate";
import { decodeAudio } from "@/lib/audio/waveform";
import { cn } from "@/lib/cn";
import { formatDuration, releaseTag, trackMeta } from "@/lib/format";
import { GENRES } from "@/lib/genres";
import { storagePath } from "@/lib/storage/paths";
import { UPLOAD_FAILED, uploadResumable } from "@/lib/storage/resumable";
import { uploadImage } from "@/lib/storage/upload-image";
import { publishChecklist } from "@/lib/tracks/checklist";
import { createDraftTrack, getTrackAudioUrl, publishTrack, saveTrackDraft, setTrackAudio } from "@/lib/tracks/actions";
import type { Track } from "@/lib/tracks/queries";
import { MOODS, RELEASE_LABEL, RELEASE_STATUSES, VOCALS, type ReleaseStatus } from "@/lib/tracks/schemas";
import { ArtworkPanel, type ArtworkState } from "./ArtworkPanel";
import { AudioPanel, type AudioState } from "./AudioPanel";
import { Panel, SideCard } from "./Panel";

type UploadFormProps = { userId: string; artistName: string; initial: Track | null; published: boolean };

const coverUrl = (path: string) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${path}`;

/** 17a — Upload a track (and 17b once published). */
export function UploadForm({ userId, artistName, initial, published }: UploadFormProps) {
  const [trackId, setTrackId] = useState<string | null>(initial?.id ?? null);
  const [audio, setAudio] = useState<AudioState | null>(
    initial?.audioPath
      ? {
          name: initial.audioPath.split("/").pop() ?? "audio",
          format: (initial.audioFormat as AudioState["format"]) ?? "mp3",
          sizeBytes: initial.audioSizeBytes ?? 0,
          durationSeconds: initial.durationSeconds,
          peaks: initial.waveform,
          progress: 1,
          uploaded: true,
          src: null,
        }
      : null,
  );
  const [audioError, setAudioError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  const [artwork, setArtwork] = useState<ArtworkState | null>(
    initial?.coverPath ? { path: initial.coverPath, url: coverUrl(initial.coverPath), label: "Current artwork" } : null,
  );
  const [artworkPending, setArtworkPending] = useState(false);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [releaseStatus, setReleaseStatus] = useState<ReleaseStatus | null>(initial?.releaseStatus ?? null);
  const [releaseDate, setReleaseDate] = useState(initial?.releaseDate ?? "");
  const [genrePrimary, setGenrePrimary] = useState(initial?.genrePrimary ?? "");
  const [bpm, setBpm] = useState(initial?.bpm ? String(initial.bpm) : "");
  const [moods, setMoods] = useState<string[]>(initial?.moods ?? []);
  const [isrc, setIsrc] = useState(initial?.isrc ?? "");
  const [rights, setRights] = useState(initial?.rightsConfirmed ?? false);

  useEffect(() => () => abort.current?.abort(), []);

  const checklist = publishChecklist({
    audioPath: audio?.uploaded ? "ok" : null,
    coverPath: artwork?.path ?? null,
    title,
    releaseStatus,
    genrePrimary: genrePrimary || null,
    bpm: bpm ? Number(bpm) : null,
    isrc,
    rightsConfirmed: rights,
  });

  async function onPickAudio(file: File) {
    setAudioError(null);
    const check = validateAudioFile(file);
    if (!check.ok) return setAudioError(check.error);

    let id = trackId;
    if (!id) {
      const draft = await createDraftTrack();
      if ("error" in draft) return setAudioError(draft.error);
      id = draft.id;
      setTrackId(id);
    }

    const path = storagePath(userId, "track", check.format);
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setAudio({ name: file.name, format: check.format, sizeBytes: file.size, durationSeconds: null, peaks: null, progress: 0, uploaded: false, src: null });

    try {
      const [decoded] = await Promise.all([
        decodeAudio(file),
        uploadResumable({
          bucket: "tracks",
          path,
          file,
          contentType: audioContentType(file, check.format),
          signal: controller.signal,
          onProgress: (p) => setAudio((a) => (a ? { ...a, progress: p } : a)),
        }),
      ]);
      const saved = await setTrackAudio(id, {
        path,
        format: check.format,
        sizeBytes: file.size,
        durationSeconds: decoded?.durationSeconds ?? null,
        peaks: decoded?.peaks ?? null,
      });
      if (!saved.ok) throw new Error(saved.error);
      setAudio({
        name: file.name,
        format: check.format,
        sizeBytes: file.size,
        durationSeconds: decoded?.durationSeconds ?? null,
        peaks: decoded?.peaks ?? null,
        progress: 1,
        uploaded: true,
        src: URL.createObjectURL(file),
      });
      if (!decoded) setAudioError("Uploaded, but your browser can't preview this file. You can still publish it.");
    } catch (e) {
      if (controller.signal.aborted) return;
      setAudio(null);
      setAudioError(e instanceof Error && e.message ? e.message : UPLOAD_FAILED);
    }
  }

  function cancelAudio() {
    abort.current?.abort();
    setAudio(null);
    setAudioError("Upload cancelled.");
  }

  async function onPickArtwork(file: File) {
    setArtworkError(null);
    setArtworkPending(true);
    const res = await uploadImage("cover", file);
    setArtworkPending(false);
    if (!res.ok) return setArtworkError(res.error);
    setArtwork({ path: res.path, url: coverUrl(res.path), label: file.name });
  }

  const noTrack: ActionState = { ok: false, error: "Add your audio file first." };
  const [publishState, publishAction, publishing] = useActionState(
    (prev: ActionState, fd: FormData) => (trackId ? publishTrack(trackId, prev, fd) : Promise.resolve(noTrack)),
    INITIAL_ACTION_STATE,
  );
  const [saveState, saveAction, saving] = useActionState(
    (prev: ActionState, fd: FormData) => (trackId ? saveTrackDraft(trackId, prev, fd) : Promise.resolve(noTrack)),
    INITIAL_ACTION_STATE,
  );
  const result = saving || saveState !== INITIAL_ACTION_STATE ? saveState : publishState;
  const fe = { ...publishState.fieldErrors, ...saveState.fieldErrors };
  const uploading = audio !== null && !audio.uploaded;

  const toggleMood = (m: string) =>
    setMoods((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : cur.length < 3 ? [...cur, m] : cur));

  return (
    <form action={publishAction} className="flex flex-col gap-6 xl:flex-row xl:items-start" noValidate>
      <input type="hidden" name="coverPath" value={artwork?.path ?? ""} />
      <input type="hidden" name="releaseStatus" value={releaseStatus ?? ""} />
      {moods.map((m) => (
        <input key={m} type="hidden" name="moods" value={m} />
      ))}

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <AudioPanel
          audio={audio}
          error={audioError}
          onPick={onPickAudio}
          onCancel={cancelAudio}
          loadSrc={() => (trackId ? getTrackAudioUrl(trackId) : Promise.resolve(null))}
        />
        <ArtworkPanel
          artwork={artwork}
          pending={artworkPending}
          error={artworkError}
          onPick={onPickArtwork}
          onRemove={() => setArtwork(null)}
        />

        <Panel number="03" title="Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} error={fe.title} />
            <Input label="Featured artists (optional)" name="featuring" defaultValue={initial?.featuring ?? ""} maxLength={100} error={fe.featuring} />
          </div>
          <Input label="Artist name" value={artistName} readOnly helper="Change it in Settings · Profile." />
          <div className="flex flex-col gap-2.5">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-body-md">Release status</span>
              <span className="text-body-sm text-muted">Demos can be pre-tested but not pitched.</span>
            </p>
            <div className="flex flex-wrap gap-2.5" role="group" aria-label="Release status">
              {RELEASE_STATUSES.map((s) => (
                <Chip key={s} active={releaseStatus === s} onClick={() => setReleaseStatus(s)}>
                  {RELEASE_LABEL[s]}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Release date" name="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} error={fe.releaseDate} />
            <Input label="Spotify or private link (optional)" name="privateLink" defaultValue={initial?.privateLink ?? ""} inputMode="url" placeholder="soundcloud.com/…" error={fe.privateLink} />
          </div>
          <Checkbox name="explicit" label="Explicit content" defaultChecked={initial?.explicit ?? false} />
        </Panel>

        <Panel number="04" title="Tags">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Primary genre" name="genrePrimary" options={GENRES} value={genrePrimary} onChange={(e) => setGenrePrimary(e.target.value)} error={fe.genrePrimary} />
            <Select label="Secondary genre (optional)" name="genreSecondary" options={GENRES} defaultValue={initial?.genreSecondary ?? ""} error={fe.genreSecondary} />
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-body-md">Moods</span>
              <span className="text-body-sm text-muted">Pick up to 3 · {moods.length} selected</span>
            </p>
            <div className="flex flex-wrap gap-2.5" role="group" aria-label="Moods">
              {MOODS.map((m) => (
                <Chip key={m} active={moods.includes(m)} onClick={() => toggleMood(m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="BPM" name="bpm" type="number" inputMode="numeric" min={40} max={250} value={bpm} onChange={(e) => setBpm(e.target.value)} error={fe.bpm} />
            <Input label="Key (optional)" name="musicalKey" defaultValue={initial?.musicalKey ?? ""} placeholder="A minor" maxLength={12} error={fe.musicalKey} />
            <Select label="Vocals" name="vocals" options={VOCALS} defaultValue={initial?.vocals ?? ""} error={fe.vocals} />
            <Input label="Length" value={formatDuration(audio?.durationSeconds) || ""} placeholder="Auto" readOnly trailing={<span className="text-label-strong text-cyan">Auto</span>} />
          </div>
        </Panel>

        <Panel number="05" title="Rights">
          <Checkbox
            name="rightsConfirmed"
            checked={rights}
            onChange={(e) => setRights(e.target.checked)}
            label="I own or control all rights to this track, including samples and vocals."
          />
          <Input
            label="ISRC (optional)"
            name="isrc"
            value={isrc}
            onChange={(e) => setIsrc(e.target.value)}
            placeholder="FR-XXX-26-00001"
            helper="Helps curators and stores identify your release."
            error={fe.isrc}
          />
        </Panel>
      </div>

      <aside className="flex w-full flex-col gap-6 xl:sticky xl:top-28 xl:w-[400px] xl:shrink-0">
        <SideCard title="Preview">
          <TrackCard
            title={title.trim() || "Untitled track"}
            meta={trackMeta({ genrePrimary: genrePrimary || null, bpm: bpm ? Number(bpm) : null, durationSeconds: audio?.durationSeconds ?? null })}
            coverUrl={artwork?.url ?? null}
            status={releaseTag(releaseStatus, releaseDate || null)}
            rating={null}
            stats="Not tested yet"
          />
        </SideCard>

        {published ? (
          <section className="flex flex-col gap-4 rounded-[2px] border border-success bg-surface-1 p-6">
            <h2 className="flex items-center gap-2 text-heading-card uppercase">
              <CircleCheck size={22} className="text-success" aria-hidden /> {title.trim() || "Your track"} is live
            </h2>
            <p className="text-body-sm text-soft-white">It&apos;s on your profile. Pitch it now, or get 20 anonymous ratings first — free.</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" href="/pitch">
                Pitch this track now
              </Button>
              <Button variant="secondary" href="/rate">
                Pre-test it first · free
              </Button>
            </div>
            <p className="text-body-sm text-muted">The Readiness score from the pre-test feeds the Match % curators see.</p>
            {(result.error || (result.ok && result.message)) && (
              <FormMessage tone={result.ok ? "success" : "error"}>{result.ok ? "Changes saved" : result.error}</FormMessage>
            )}
            <Button type="submit" formAction={saveAction} variant="ghost" loading={saving} className="self-start">
              Save changes
            </Button>
          </section>
        ) : (
          <SideCard title="Ready to publish" aside={<span className="text-label-strong text-cyan">{checklist.doneCount} / 6</span>}>
            <ul className="flex flex-col gap-3" aria-label="Publish checklist">
              {checklist.items.map((item) => (
                <li key={item.key} className={cn("flex items-center gap-2.5 text-body-md", item.done ? "text-soft-white" : "text-muted")}>
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[2px] border",
                      item.done ? "border-success bg-success text-midnight" : "border-border-strong",
                    )}
                  >
                    {item.done && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={item.done ? "text-white" : undefined}>{item.label}</span>
                  {item.optional && <span className="text-body-sm text-muted">optional</span>}
                  <span className="sr-only">{item.done ? "done" : "to do"}</span>
                </li>
              ))}
            </ul>
            {result.error && <FormMessage tone="error">{result.error}</FormMessage>}
            {result.ok && result.message === "Draft saved" && <FormMessage tone="success">Draft saved</FormMessage>}
            <Button type="submit" variant="primary" loading={publishing} disabled={!checklist.canPublish || uploading} className="self-start">
              Publish track
            </Button>
            <Button type="submit" formAction={saveAction} variant="ghost" loading={saving} disabled={uploading} className="self-start">
              Save as draft
            </Button>
            <p className="text-body-sm text-muted">Next: a free pre-test (20 anonymous ratings), then pitch it to curators.</p>
          </SideCard>
        )}
      </aside>
    </form>
  );
}

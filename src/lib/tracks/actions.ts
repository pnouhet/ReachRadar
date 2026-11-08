"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fieldErrorsOf, type ActionState } from "@/lib/action-state";
import { createServerSupabase } from "@/lib/supabase/server";
import { publishChecklist } from "./checklist";
import { trackFieldsSchema, trackFormValues, type TrackFields } from "./schemas";

async function session() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id ?? null };
}

function toColumns(f: TrackFields) {
  return {
    title: f.title,
    featuring: f.featuring,
    release_status: f.releaseStatus,
    release_date: f.releaseDate,
    private_link: f.privateLink,
    explicit: f.explicit,
    genre_primary: f.genrePrimary,
    genre_secondary: f.genreSecondary,
    moods: f.moods,
    bpm: f.bpm,
    musical_key: f.musicalKey,
    vocals: f.vocals,
    isrc: f.isrc,
    rights_confirmed: f.rightsConfirmed,
    cover_path: f.coverPath,
  };
}

/** Creates an empty draft owned by the current artist; called when the first audio file is chosen. */
export async function createDraftTrack(): Promise<{ id: string } | { error: string }> {
  const { supabase, userId } = await session();
  if (!userId) return { error: "Your session has expired. Log in again." };
  const { data, error } = await supabase.from("tracks").insert({ owner_id: userId }).select("id").single();
  if (error || !data) return { error: "We couldn't start your upload. Please try again." };
  return { id: data.id };
}

type AudioMeta = { path: string; format: "mp3" | "flac" | "wav"; sizeBytes: number; durationSeconds: number | null; peaks: number[] | null };

/** Records the audio the browser uploaded to `tracks/{userId}/…`. */
export async function setTrackAudio(trackId: string, meta: AudioMeta): Promise<ActionState> {
  const { supabase, userId } = await session();
  if (!userId) return { ok: false, error: "Your session has expired. Log in again." };
  if (!meta.path.startsWith(`${userId}/`)) return { ok: false, error: "Invalid file." };

  const { data: before } = await supabase.from("tracks").select("audio_path").eq("id", trackId).single();
  const { error } = await supabase
    .from("tracks")
    .update({
      audio_path: meta.path,
      audio_format: meta.format,
      audio_size_bytes: meta.sizeBytes,
      duration_seconds: meta.durationSeconds,
      waveform: meta.peaks,
    })
    .eq("id", trackId);
  if (error) return { ok: false, error: "We couldn't save your audio. Please try again." };
  if (before?.audio_path && before.audio_path !== meta.path) await supabase.storage.from("tracks").remove([before.audio_path]);
  return { ok: true };
}

/** Short-lived signed URL to play the owner's private audio. */
export async function getTrackAudioUrl(trackId: string): Promise<string | null> {
  const { supabase, userId } = await session();
  if (!userId) return null;
  const { data: track } = await supabase.from("tracks").select("audio_path, owner_id").eq("id", trackId).single();
  if (!track?.audio_path || track.owner_id !== userId) return null;
  const { data } = await supabase.storage.from("tracks").createSignedUrl(track.audio_path, 3600);
  return data?.signedUrl ?? null;
}

async function saveFields(trackId: string, formData: FormData, publish: boolean): Promise<ActionState> {
  const parsed = trackFieldsSchema.safeParse(trackFormValues(formData));
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error) };

  const { supabase, userId } = await session();
  if (!userId) return { ok: false, error: "Your session has expired. Log in again." };
  if (parsed.data.coverPath && !parsed.data.coverPath.startsWith(`${userId}/`)) return { ok: false, error: "Invalid artwork." };

  const { data: track } = await supabase.from("tracks").select("id, audio_path").eq("id", trackId).single();
  if (!track) return { ok: false, error: "This track no longer exists." };

  if (publish) {
    const check = publishChecklist({ ...parsed.data, audioPath: track.audio_path });
    if (!check.canPublish) {
      const missing = check.items.filter((i) => !i.optional && !i.done).map((i) => i.label.toLowerCase());
      return { ok: false, error: `Almost there — still missing: ${missing.join(", ")}.` };
    }
  }

  const { error } = await supabase
    .from("tracks")
    .update({ ...toColumns(parsed.data), ...(publish ? { status: "published" as const } : {}) })
    .eq("id", trackId);
  if (error) return { ok: false, error: "We couldn't save this track. Please try again." };

  revalidatePath("/profile");
  return { ok: true, message: publish ? "Published" : "Draft saved" };
}

export async function saveTrackDraft(trackId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return saveFields(trackId, formData, false);
}

export async function publishTrack(trackId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const res = await saveFields(trackId, formData, true);
  if (!res.ok) return res;
  redirect(`/profile/upload?published=${trackId}`);
}

export async function deleteTrack(trackId: string): Promise<ActionState> {
  const { supabase, userId } = await session();
  if (!userId) return { ok: false, error: "Your session has expired. Log in again." };
  const { data: track } = await supabase.from("tracks").select("audio_path, cover_path").eq("id", trackId).single();
  const { error } = await supabase.from("tracks").delete().eq("id", trackId);
  if (error) return { ok: false, error: "We couldn't delete this track." };
  if (track?.audio_path) await supabase.storage.from("tracks").remove([track.audio_path]);
  if (track?.cover_path) await supabase.storage.from("covers").remove([track.cover_path]);
  revalidatePath("/profile");
  return { ok: true };
}

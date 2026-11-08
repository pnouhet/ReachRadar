import "server-only";
import { publicStorageUrl } from "@/lib/profile/queries";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Database } from "@/types/db";

type TrackRow = Database["public"]["Tables"]["tracks"]["Row"];

export type Track = {
  id: string;
  status: "draft" | "published";
  title: string | null;
  featuring: string | null;
  releaseStatus: "released" | "upcoming" | "demo" | null;
  releaseDate: string | null;
  privateLink: string | null;
  explicit: boolean;
  genrePrimary: string | null;
  genreSecondary: string | null;
  moods: string[];
  bpm: number | null;
  musicalKey: string | null;
  vocals: string | null;
  durationSeconds: number | null;
  isrc: string | null;
  rightsConfirmed: boolean;
  audioPath: string | null;
  audioFormat: string | null;
  audioSizeBytes: number | null;
  coverPath: string | null;
  coverUrl: string | null;
  waveform: number[] | null;
  updatedAt: string;
};

function toTrack(r: TrackRow): Track {
  return {
    id: r.id,
    status: r.status,
    title: r.title,
    featuring: r.featuring,
    releaseStatus: r.release_status,
    releaseDate: r.release_date,
    privateLink: r.private_link,
    explicit: r.explicit,
    genrePrimary: r.genre_primary,
    genreSecondary: r.genre_secondary,
    moods: r.moods ?? [],
    bpm: r.bpm,
    musicalKey: r.musical_key,
    vocals: r.vocals,
    durationSeconds: r.duration_seconds,
    isrc: r.isrc,
    rightsConfirmed: r.rights_confirmed,
    audioPath: r.audio_path,
    audioFormat: r.audio_format,
    audioSizeBytes: r.audio_size_bytes,
    coverPath: r.cover_path,
    coverUrl: publicStorageUrl("covers", r.cover_path),
    waveform: Array.isArray(r.waveform) ? (r.waveform as number[]) : null,
    updatedAt: r.updated_at,
  };
}

/** The current user's tracks (drafts + published), newest first. */
export async function getMyTracks(userId: string): Promise<Track[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("tracks").select("*").eq("owner_id", userId).order("updated_at", { ascending: false });
  return (data ?? []).map(toTrack);
}

export async function getMyTrack(userId: string, id: string): Promise<Track | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("tracks").select("*").eq("id", id).eq("owner_id", userId).maybeSingle();
  return data ? toTrack(data) : null;
}

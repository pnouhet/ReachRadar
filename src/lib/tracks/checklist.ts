import { ISRC_PATTERN, type ReleaseStatus } from "./schemas";

export type ChecklistInput = {
  audioPath?: string | null;
  coverPath?: string | null;
  title?: string | null;
  releaseStatus?: ReleaseStatus | null;
  genrePrimary?: string | null;
  bpm?: number | null;
  isrc?: string | null;
  rightsConfirmed?: boolean;
};

export type ChecklistItem = {
  key: "audio" | "artwork" | "title" | "genre" | "isrc" | "rights";
  label: string;
  done: boolean;
  optional: boolean;
};

/** 17a "Ready to publish n / 6". Mirrors the DB constraint `published_requires_fields`. */
export function publishChecklist(t: ChecklistInput): { items: ChecklistItem[]; doneCount: number; canPublish: boolean } {
  const isrc = (t.isrc ?? "").replace(/[-\s]/g, "").toUpperCase();
  const items: ChecklistItem[] = [
    { key: "audio", label: "Mastered audio", done: Boolean(t.audioPath), optional: false },
    { key: "artwork", label: "Artwork 1000 × 1000+", done: Boolean(t.coverPath), optional: false },
    { key: "title", label: "Title and release status", done: Boolean(t.title?.trim() && t.releaseStatus), optional: false },
    { key: "genre", label: "Genre and BPM", done: Boolean(t.genrePrimary && t.bpm), optional: false },
    { key: "isrc", label: "ISRC code", done: ISRC_PATTERN.test(isrc), optional: true },
    { key: "rights", label: "Rights confirmed", done: Boolean(t.rightsConfirmed), optional: false },
  ];
  return {
    items,
    doneCount: items.filter((i) => i.done).length,
    canPublish: items.every((i) => i.optional || i.done),
  };
}

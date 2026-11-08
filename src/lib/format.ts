export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return "";
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const LABEL = { released: "Released", upcoming: "Upcoming", demo: "Demo" } as const;

/** Cover tag text, e.g. "Upcoming · Nov 21". */
export function releaseTag(status: keyof typeof LABEL | null, date: string | null): string | null {
  if (!status) return null;
  if (status === "upcoming" && date) {
    const d = new Date(`${date}T00:00:00Z`);
    const when = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    return `${LABEL[status]} · ${when}`;
  }
  return LABEL[status];
}

export function trackMeta(t: { genrePrimary: string | null; bpm: number | null; durationSeconds: number | null }): string {
  return [t.genrePrimary, t.bpm ? `${t.bpm} BPM` : null, formatDuration(t.durationSeconds) || null].filter(Boolean).join(" · ");
}

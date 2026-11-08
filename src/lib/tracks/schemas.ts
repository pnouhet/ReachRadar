import { z } from "zod";
import { GENRES } from "@/lib/genres";

/** Moods offered on 17a (Figma), max 3. */
export const MOODS = ["Hypnotic", "Late night", "Euphoric", "Dark", "Melancholic", "Driving", "Dreamy", "Uplifting", "Groovy", "Chill"] as const;
export const VOCALS = ["Instrumental", "Male vocals", "Female vocals", "Mixed vocals", "Rap"] as const;
export const RELEASE_STATUSES = ["released", "upcoming", "demo"] as const;
export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

export const RELEASE_LABEL: Record<ReleaseStatus, string> = { released: "Released", upcoming: "Upcoming", demo: "Demo" };

export const ISRC_PATTERN = /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/;

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);
const text = (max: number) => z.preprocess(emptyToNull, z.string().trim().max(max, `${max} characters max.`).nullable());

/** Editable fields of a track. Everything is optional for a draft; publishChecklist decides publishability. */
export const trackFieldsSchema = z.object({
  title: text(100),
  featuring: text(100),
  releaseStatus: z.preprocess(emptyToNull, z.enum(RELEASE_STATUSES).nullable()),
  releaseDate: z.preprocess(emptyToNull, z.iso.date("Pick a valid date.").nullable()),
  privateLink: z.preprocess(
    emptyToNull,
    z
      .string()
      .trim()
      .max(500)
      .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
      .refine((v) => URL.canParse(v) && new URL(v).hostname.includes("."), "Paste a full web link.")
      .nullable(),
  ),
  explicit: z.boolean(),
  genrePrimary: z.preprocess(emptyToNull, z.enum(GENRES).nullable()),
  genreSecondary: z.preprocess(emptyToNull, z.enum(GENRES).nullable()),
  moods: z.array(z.enum(MOODS)).max(3, "Pick up to 3 moods."),
  bpm: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().int("Whole numbers only.").min(40, "Between 40 and 250.").max(250, "Between 40 and 250.").nullable(),
  ),
  musicalKey: text(12),
  vocals: z.preprocess(emptyToNull, z.enum(VOCALS).nullable()),
  isrc: z.preprocess(
    (v) => (typeof v === "string" ? (v.replace(/[-\s]/g, "").toUpperCase() || null) : v),
    z.string().regex(ISRC_PATTERN, "ISRC looks like FR-Z03-24-00001.").nullable(),
  ),
  rightsConfirmed: z.boolean(),
  coverPath: z.preprocess(emptyToNull, z.string().max(300).nullable()),
});

export type TrackFields = z.output<typeof trackFieldsSchema>;

/** Reads the 17a form. */
export function trackFormValues(formData: FormData): Record<string, unknown> {
  const get = (k: string) => String(formData.get(k) ?? "");
  return {
    title: get("title"),
    featuring: get("featuring"),
    releaseStatus: get("releaseStatus"),
    releaseDate: get("releaseDate"),
    privateLink: get("privateLink"),
    explicit: formData.get("explicit") === "on",
    genrePrimary: get("genrePrimary"),
    genreSecondary: get("genreSecondary"),
    moods: formData.getAll("moods").map(String),
    bpm: get("bpm"),
    musicalKey: get("musicalKey"),
    vocals: get("vocals"),
    isrc: get("isrc"),
    rightsConfirmed: formData.get("rightsConfirmed") === "on",
    coverPath: get("coverPath"),
  };
}

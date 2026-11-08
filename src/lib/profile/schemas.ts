import { z } from "zod";
import { GENRES } from "@/lib/genres";

export const LINK_FIELDS = [
  { key: "spotify", label: "Spotify", placeholder: "open.spotify.com/artist/…", handle: false },
  { key: "soundcloud", label: "SoundCloud", placeholder: "soundcloud.com/…", handle: false },
  { key: "instagram", label: "Instagram", placeholder: "@yourname", handle: true },
  { key: "youtube", label: "YouTube", placeholder: "Add a link", handle: false },
  { key: "tiktok", label: "TikTok", placeholder: "Add a link", handle: true },
  { key: "deezer", label: "Deezer", placeholder: "Add a link", handle: false },
] as const;

export type LinkKey = (typeof LINK_FIELDS)[number]["key"];

const HANDLE = /^@[\w.]{1,30}$/;

/** Normalises a user-typed link to https, or returns null when it is not a safe web link. */
export function normaliseLink(raw: string, allowHandle: boolean): string | null {
  const v = raw.trim();
  if (allowHandle && HANDLE.test(v)) return v;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(v);
  if (hasScheme && !/^https?:\/\//i.test(v)) return null;
  const withScheme = hasScheme ? v : `https://${v}`;
  if (!URL.canParse(withScheme)) return null;
  const url = new URL(withScheme);
  if (!url.hostname.includes(".")) return null;
  const s = url.toString();
  return url.pathname === "/" && !url.search && !url.hash ? s.replace(/\/$/, "") : s;
}

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((v) => (v === "" ? null : v));

const linksSchema = z.record(z.string(), z.string()).transform((raw, ctx) => {
  const out: Partial<Record<LinkKey, string>> = {};
  for (const field of LINK_FIELDS) {
    const value = raw[field.key]?.trim();
    if (!value) continue;
    const normalised = normaliseLink(value, field.handle);
    if (!normalised) {
      ctx.addIssue({
        code: "custom",
        path: [field.key],
        message: field.handle ? "Paste a link or an @handle." : "Paste a full web link.",
      });
      continue;
    }
    out[field.key] = normalised;
  }
  return out;
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, "At least 2 characters.").max(60, "60 characters max."),
  bio: optionalText(300, "300 characters max."),
  location: optionalText(80, "80 characters max."),
  genres: z.array(z.enum(GENRES)).max(5, "Pick up to 5 genres."),
  links: linksSchema,
});

export type ProfileInput = z.input<typeof profileSchema>;
export type ProfileValues = z.output<typeof profileSchema>;

/** Reads the 16a form into the shape profileSchema expects. */
export function profileFormValues(formData: FormData): ProfileInput {
  const links: Record<string, string> = {};
  for (const field of LINK_FIELDS) links[field.key] = String(formData.get(`links.${field.key}`) ?? "");
  return {
    displayName: String(formData.get("displayName") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    location: String(formData.get("location") ?? ""),
    genres: formData.getAll("genres").map(String) as ProfileInput["genres"],
    links,
  };
}

export type StorageKind = "avatar" | "banner" | "cover" | "track";

/** `{userId}/{kind}-{timestamp}.{ext}` — the first folder is what Storage RLS checks. */
export function storagePath(userId: string, kind: StorageKind, ext: string): string {
  return `${userId}/${kind}-${Date.now()}.${ext.toLowerCase().replace(/^\./, "")}`;
}

export function extensionOf(fileName: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(fileName);
  return m ? m[1].toLowerCase() : "";
}

export const BUCKET_FOR: Record<StorageKind, string> = {
  avatar: "avatars",
  banner: "banners",
  cover: "covers",
  track: "tracks",
};

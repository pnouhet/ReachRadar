export type ImageKind = "avatar" | "banner" | "cover";
export type ImageCheck = { ok: true } | { ok: false; error: string };

const MAX_MB: Record<ImageKind, number> = { avatar: 5, banner: 10, cover: 10 };
const TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Type and size check, before any upload. */
export function validateImage(file: File, kind: ImageKind): ImageCheck {
  if (!TYPES.includes(file.type)) return { ok: false, error: "Use a JPG, PNG or WebP image." };
  if (file.size > MAX_MB[kind] * 1024 * 1024) return { ok: false, error: `Image too large — max ${MAX_MB[kind]} MB.` };
  return { ok: true };
}

/** Minimum pixel sizes (browser only: uses createImageBitmap). */
export async function checkImageDimensions(file: File, kind: ImageKind): Promise<ImageCheck> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap.close();
  if (kind === "banner" && (width < 1600 || height < 400)) {
    return { ok: false, error: "Banner must be at least 1600 × 400 px." };
  }
  if (kind === "cover" && (width !== height || width < 1000)) {
    return { ok: false, error: "Artwork must be square, at least 1000 × 1000 px." };
  }
  if (kind === "avatar" && (width < 200 || height < 200)) {
    return { ok: false, error: "Photo must be at least 200 × 200 px." };
  }
  return { ok: true };
}

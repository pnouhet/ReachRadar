"use client";

import { createBrowserSupabase } from "@/lib/supabase/client";
import { checkImageDimensions, validateImage, type ImageKind } from "./images";
import { BUCKET_FOR, extensionOf, storagePath } from "./paths";

export type UploadResult = { ok: true; path: string } | { ok: false; error: string };

/** Validates then uploads an image straight from the browser to `{bucket}/{userId}/…`. */
export async function uploadImage(kind: ImageKind, file: File): Promise<UploadResult> {
  const typeCheck = validateImage(file, kind);
  if (!typeCheck.ok) return typeCheck;
  const sizeCheck = await checkImageDimensions(file, kind).catch(() => ({ ok: false as const, error: "We couldn't read this image." }));
  if (!sizeCheck.ok) return sizeCheck;

  const supabase = createBrowserSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, error: "Your session has expired. Log in again." };

  const ext = extensionOf(file.name) || file.type.split("/")[1];
  const path = storagePath(data.user.id, kind, ext === "jpeg" ? "jpg" : ext);
  const { error } = await supabase.storage
    .from(BUCKET_FOR[kind])
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) return { ok: false, error: "Upload failed — check your connection and try again." };
  return { ok: true, path };
}

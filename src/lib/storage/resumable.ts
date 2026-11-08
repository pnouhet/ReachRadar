"use client";

import * as tus from "tus-js-client";
import { createBrowserSupabase } from "@/lib/supabase/client";

type ResumableOptions = {
  bucket: string;
  path: string;
  file: File;
  contentType: string;
  onProgress?: (fraction: number) => void;
  signal?: AbortSignal;
};

export const UPLOAD_FAILED = "Upload failed — check your connection and try again.";

/**
 * Uploads a file straight from the browser to Supabase Storage with the TUS resumable protocol
 * (6 MB chunks, automatic retries within the upload). Never goes through a Next.js route.
 *
 * Uploads are never resumed across attempts: tus fingerprints a file by name/size/date only, so a
 * resumed upload would keep writing to the object path of the earlier attempt, not to `path`.
 */
export async function uploadResumable({ bucket, path, file, contentType, onProgress, signal }: ResumableOptions): Promise<void> {
  const supabase = createBrowserSupabase();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Log in again.");
  if (signal?.aborted) throw new DOMException("Upload cancelled", "AbortError");

  return new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000],
      headers: {
        authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      storeFingerprintForResuming: false,
      chunkSize: 6 * 1024 * 1024,
      metadata: { bucketName: bucket, objectName: path, contentType, cacheControl: "3600" },
      onProgress: (sent, total) => onProgress?.(total ? sent / total : 0),
      onError: () => reject(new Error(UPLOAD_FAILED)),
      onSuccess: () => resolve(),
    });

    signal?.addEventListener("abort", () => {
      void upload.abort(true);
      reject(new DOMException("Upload cancelled", "AbortError"));
    });

    upload.start();
  });
}

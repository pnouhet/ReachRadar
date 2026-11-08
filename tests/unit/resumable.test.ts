import { beforeEach, describe, expect, it, vi } from "vitest";

const created: { options: Record<string, unknown>; findPreviousUploads: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn> }[] = [];

vi.mock("tus-js-client", () => ({
  Upload: class {
    options: Record<string, unknown>;
    findPreviousUploads = vi.fn(async () => [{ uploadUrl: "https://x/old-upload" }]);
    resumeFromPreviousUpload = vi.fn();
    start = vi.fn(() => (this.options.onSuccess as () => void)());
    abort = vi.fn(async () => undefined);
    constructor(_file: File, options: Record<string, unknown>) {
      this.options = options;
      created.push(this as never);
    }
  },
}));

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabase: () => ({ auth: { getSession: async () => ({ data: { session: { access_token: "token" } } }) } }),
}));

describe("uploadResumable", () => {
  beforeEach(() => {
    created.length = 0;
  });

  it("never resumes an earlier upload, which could have been stored under another path", async () => {
    const { uploadResumable } = await import("@/lib/storage/resumable");
    const file = new File(["abc"], "song.wav", { type: "audio/wav" });
    await uploadResumable({ bucket: "tracks", path: "u1/track-2.wav", file, contentType: "audio/wav" });

    const [upload] = created;
    expect(upload.findPreviousUploads).not.toHaveBeenCalled();
    expect(upload.options.storeFingerprintForResuming).toBe(false);
    expect((upload.options.metadata as Record<string, string>).objectName).toBe("u1/track-2.wav");
    expect(upload.start).toHaveBeenCalledOnce();
  });
});

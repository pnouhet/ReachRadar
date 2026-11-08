"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { removeProfileImage, setProfileImage } from "@/lib/profile/actions";
import { uploadImage } from "@/lib/storage/upload-image";

type Status = { tone: "error" | "success"; text: string } | null;

function useImageSlot(slot: "avatar" | "banner") {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>(null);

  const upload = (file: File) =>
    startTransition(async () => {
      setStatus(null);
      const res = await uploadImage(slot, file);
      if (!res.ok) return setStatus({ tone: "error", text: res.error });
      const saved = await setProfileImage(slot, res.path);
      setStatus(saved.ok ? { tone: "success", text: saved.message! } : { tone: "error", text: saved.error! });
    });

  const remove = () =>
    startTransition(async () => {
      const res = await removeProfileImage(slot);
      setStatus(res.ok ? { tone: "success", text: res.message! } : { tone: "error", text: res.error! });
    });

  return { pending, status, upload, remove };
}

const ACCEPT = "image/jpeg,image/png,image/webp";

export function AvatarField({ name, url }: { name: string; url: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const { pending, status, upload, remove } = useImageSlot("avatar");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-5">
        <Avatar src={url} name={name} size={80} className={cn(pending && "opacity-50")} />
        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-label="Profile photo"
          data-testid="avatar-input"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <Button variant="secondary" loading={pending} onClick={() => input.current?.click()}>
          Change photo
        </Button>
        {url && (
          <Button variant="ghost" disabled={pending} onClick={remove}>
            Remove
          </Button>
        )}
      </div>
      {status && <FormMessage tone={status.tone}>{status.text}</FormMessage>}
    </div>
  );
}

export function BannerField({ url }: { url: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const { pending, status, upload, remove } = useImageSlot("banner");
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-label="Profile banner"
        data-testid="banner-input"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      {url ? (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/1] w-full overflow-hidden rounded-[2px] border border-border-subtle">
            <Image src={url} alt="Your banner" fill sizes="720px" className={cn("object-cover", pending && "opacity-50")} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary" loading={pending} onClick={() => input.current?.click()}>
              Replace banner
            </Button>
            <Button variant="ghost" disabled={pending} onClick={remove}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) upload(f);
          }}
          disabled={pending}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-[2px] border border-dashed py-10 transition-colors",
            dragging ? "border-cyan bg-cyan/5" : "border-border-strong hover:border-slate",
          )}
        >
          <Upload size={22} strokeWidth={1.5} className="text-cyan" aria-hidden />
          <span className="text-label-strong text-white">{pending ? "Uploading…" : "Upload a banner"}</span>
          <span className="text-body-sm text-muted">JPG or PNG · 1600 × 400 min.</span>
        </button>
      )}
      {status && <FormMessage tone={status.tone}>{status.text}</FormMessage>}
    </div>
  );
}

"use client";

import { Check, FileAudio, Music, Pause, Play, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Waveform } from "@/components/tracks/Waveform";
import { AUDIO_ACCEPT, AUDIO_HELP } from "@/lib/audio/validate";
import { cn } from "@/lib/cn";
import { formatBytes, formatDuration } from "@/lib/format";
import { Panel } from "./Panel";

export type AudioState = {
  name: string;
  format: "mp3" | "flac" | "wav";
  sizeBytes: number;
  durationSeconds: number | null;
  peaks: number[] | null;
  /** 0..1 while uploading, 1 when stored. */
  progress: number;
  uploaded: boolean;
  /** Object URL (fresh upload) or signed URL (existing draft) for playback. */
  src: string | null;
};

type AudioPanelProps = {
  audio: AudioState | null;
  error: string | null;
  onPick: (file: File) => void;
  onCancel: () => void;
  loadSrc: () => Promise<string | null>;
};

/** 17a · 01 Audio — file row, upload progress, player with waveform. */
export function AudioPanel({ audio, error, onPick, onCancel, loadSrc }: AudioPanelProps) {
  const input = useRef<HTMLInputElement>(null);
  const player = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dragging, setDragging] = useState(false);
  const uploading = audio !== null && !audio.uploaded;

  function pickFile(file: File) {
    const el = player.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    setPlaying(false);
    setTime(0);
    onPick(file);
  }

  async function togglePlay() {
    const el = player.current;
    if (!el || !audio) return;
    if (!el.src) {
      const src = audio.src ?? (await loadSrc());
      if (!src) return;
      el.src = src;
    }
    if (el.paused) await el.play().catch(() => undefined);
    else el.pause();
  }

  const pick = (
    <input
      ref={input}
      type="file"
      accept={AUDIO_ACCEPT}
      className="sr-only"
      aria-label="Audio file"
      data-testid="audio-input"
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) pickFile(f);
        e.target.value = "";
      }}
    />
  );

  return (
    <Panel
      number="01"
      title="Audio"
      action={
        audio && !uploading ? (
          <button type="button" onClick={() => input.current?.click()} className="text-label-strong text-cyan hover:underline">
            Replace file
          </button>
        ) : undefined
      }
    >
      {pick}
      {audio ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Music size={20} strokeWidth={1.5} className="shrink-0 text-cyan" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-body-md">{audio.name}</span>
              <span className="text-body-sm text-muted">
                {[audio.format.toUpperCase(), formatBytes(audio.sizeBytes), formatDuration(audio.durationSeconds)].filter(Boolean).join(" · ")}
              </span>
            </div>
            {uploading ? (
              <span className="flex items-center gap-3 text-label-strong text-cyan" aria-live="polite">
                Uploading {Math.round(audio.progress * 100)}%
                <button type="button" onClick={onCancel} aria-label="Cancel upload" className="text-soft-white hover:text-white">
                  <X size={18} aria-hidden />
                </button>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-label-strong text-success">
                <Check size={16} strokeWidth={2.5} aria-hidden /> Uploaded
              </span>
            )}
          </div>
          <div className="h-0.5 w-full bg-border-subtle" role="progressbar" aria-label="Upload progress" aria-valuenow={Math.round(audio.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className={cn("h-full transition-[width]", uploading ? "bg-cyan" : "bg-success")} style={{ width: `${audio.progress * 100}%` }} />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              disabled={uploading}
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-8 shrink-0 items-center justify-center bg-cyan text-midnight disabled:opacity-40"
            >
              {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </button>
            <Waveform peaks={audio.peaks} progress={audio.durationSeconds ? time / audio.durationSeconds : 0} />
            <span className="shrink-0 text-body-sm text-muted tabular-nums">
              {formatDuration(time)} / {formatDuration(audio.durationSeconds) || "–"}
            </span>
          </div>
          <audio
            ref={player}
            preload="none"
            data-testid="audio-player"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          />
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
            if (f) pickFile(f);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-[2px] border border-dashed py-10 transition-colors",
            dragging ? "border-cyan bg-cyan/5" : "border-border-strong hover:border-slate",
          )}
        >
          <Upload size={22} strokeWidth={1.5} className="text-cyan" aria-hidden />
          <span className="text-label-strong">Choose an audio file</span>
          <span className="text-body-sm text-muted">or drag and drop it here</span>
        </button>
      )}
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <p className="flex items-center gap-2 text-body-sm text-muted">
        <FileAudio size={16} strokeWidth={1.5} aria-hidden /> {AUDIO_HELP}
      </p>
    </Panel>
  );
}

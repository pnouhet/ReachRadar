import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = { src?: string | null; name: string; size: number; className?: string };

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? "")
    .join("")
    .toUpperCase();
}

/** Round avatar (the only round shape allowed). Without an image: initials on a cyan→slate gradient. */
export function Avatar({ src, name, size, className }: AvatarProps) {
  const style = { width: size, height: size };
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        style={style}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={name}
      style={{ ...style, fontSize: Math.max(13, Math.round(size * 0.33)) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-r from-cyan to-midnight font-body font-semibold tracking-[0.06em] text-white",
        className,
      )}
    >
      <span aria-hidden>{initialsOf(name)}</span>
    </span>
  );
}

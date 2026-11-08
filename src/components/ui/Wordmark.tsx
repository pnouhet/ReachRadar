import Image from "next/image";

type WordmarkProps = { className?: string; width?: number; echo?: boolean };

/** ReachRadar wordmark exported from Figma (400×20 artboard). */
export function Wordmark({ className, width = 200, echo = false }: WordmarkProps) {
  return (
    <Image
      src={echo ? "/brand/wordmark-echo.svg" : "/brand/wordmark.svg"}
      alt="ReachRadar"
      width={width}
      height={Math.round((width / 400) * 20)}
      className={className}
      priority
      unoptimized
    />
  );
}

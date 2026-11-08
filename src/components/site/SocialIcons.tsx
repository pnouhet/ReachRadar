import Image from "next/image";

const SOCIALS = [
  { name: "SoundCloud", src: "/home/soundcloud.svg" },
  { name: "YouTube", src: "/home/youtube.svg" },
  { name: "Deezer", src: "/home/deezer.svg" },
  { name: "TikTok", src: "/home/tiktok.svg" },
  { name: "Spotify", src: "/home/spotify.svg" },
];

/** Brand marks only: ReachRadar has no public social accounts yet, so they are not links. */
export function SocialIcons() {
  return (
    <ul className="flex gap-7 max-[860px]:gap-6" aria-label="ReachRadar on social media">
      {SOCIALS.map((s) => (
        <li key={s.name}>
          <Image src={s.src} width={24} height={24} alt={s.name} unoptimized />
        </li>
      ))}
    </ul>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UploadForm } from "@/components/upload/UploadForm";
import { getCurrentProfile } from "@/lib/profile/queries";
import { getMyTrack } from "@/lib/tracks/queries";

export const metadata = { title: "Upload a track" };

export default async function UploadTrackPage(props: PageProps<"/profile/upload">) {
  const { track, published } = await props.searchParams;
  const profile = await getCurrentProfile();
  const id = typeof published === "string" ? published : typeof track === "string" ? track : null;
  const initial = id ? await getMyTrack(profile.id, id) : null;
  if (id && !initial) notFound();

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-sm">
        <ArrowLeft size={16} strokeWidth={1.5} className="text-soft-white" aria-hidden />
        <Link href="/profile" className="text-soft-white hover:text-white">
          My profile
        </Link>
        <span className="text-muted">/</span>
        <span className="text-white" aria-current="page">
          {initial ? "Edit track" : "Upload a track"}
        </span>
      </nav>
      <header className="flex flex-col gap-2.5">
        <h1 className="text-page-title text-gradient">{initial ? "Edit your track" : "Upload a track"}</h1>
        <p className="text-body-md text-soft-white">Add it once. Pre-test it for free, then pitch it to curators.</p>
      </header>
      <UploadForm
        key={initial?.id ?? "new"}
        userId={profile.id}
        artistName={profile.displayName}
        initial={initial}
        published={typeof published === "string" || initial?.status === "published"}
      />
    </div>
  );
}

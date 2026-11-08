import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Role } from "@/lib/nav";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseUrl } from "@/lib/supabase/env";

export type ProfileLinks = Partial<Record<"spotify" | "soundcloud" | "instagram" | "youtube" | "tiktok" | "website" | "playlist", string>>;

export type Profile = {
  id: string;
  email: string;
  role: Role;
  displayName: string;
  slug: string;
  bio: string | null;
  location: string | null;
  genres: string[];
  links: ProfileLinks;
  curatorType: "playlist" | "label" | "radio" | "blog" | null;
  avatarPath: string | null;
  bannerPath: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
};

export function publicStorageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  return `${supabaseUrl()}/storage/v1/object/public/${bucket}/${path}`;
}

/** The signed-in user's profile, once per request. Redirects to /login without a session. */
export const getCurrentProfile = cache(async (): Promise<Profile> => {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: row, error } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
  if (error || !row) redirect("/login?error=link");

  return {
    id: row.id,
    email: auth.user.email ?? "",
    role: row.role,
    displayName: row.display_name,
    slug: row.slug,
    bio: row.bio,
    location: row.location,
    genres: row.genres ?? [],
    links: (row.links ?? {}) as ProfileLinks,
    curatorType: row.curator_type,
    avatarPath: row.avatar_path,
    bannerPath: row.banner_path,
    avatarUrl: publicStorageUrl("avatars", row.avatar_path),
    bannerUrl: publicStorageUrl("banners", row.banner_path),
  };
});

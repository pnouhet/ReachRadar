"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsOf, type ActionState } from "@/lib/action-state";
import { BUCKET_FOR } from "@/lib/storage/paths";
import { createServerSupabase } from "@/lib/supabase/server";
import { profileFormValues, profileSchema } from "./schemas";

type ImageSlot = "avatar" | "banner";
const COLUMN: Record<ImageSlot, "avatar_path" | "banner_path"> = { avatar: "avatar_path", banner: "banner_path" };

async function currentUserId() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id ?? null };
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse(profileFormValues(formData));
  if (!parsed.success) {
    const fieldErrors = fieldErrorsOf(parsed.error);
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "links" && issue.path[1]) fieldErrors[`links.${String(issue.path[1])}`] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const { supabase, userId } = await currentUserId();
  if (!userId) return { ok: false, error: "Your session has expired. Log in again." };

  const { displayName, bio, location, genres, links } = parsed.data;
  const { data: current } = await supabase.from("profiles").select("links").eq("id", userId).single();
  const keep = (current?.links ?? {}) as Record<string, string>;
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      bio,
      location,
      genres,
      // Links not edited on 16a (e.g. a curator's playlist link from sign-up) are preserved.
      links: { ...(keep.playlist ? { playlist: keep.playlist } : {}), ...links },
    })
    .eq("id", userId);
  if (error) return { ok: false, error: "We couldn't save your profile. Please try again." };

  revalidatePath("/", "layout");
  return { ok: true, message: "Profile updated" };
}

/** Records an image the browser already uploaded to `{userId}/…`, and deletes the previous one. */
export async function setProfileImage(slot: ImageSlot, path: string): Promise<ActionState> {
  const { supabase, userId } = await currentUserId();
  if (!userId) return { ok: false, error: "Your session has expired. Log in again." };
  if (!path.startsWith(`${userId}/${slot}-`)) return { ok: false, error: "Invalid file." };

  const column = COLUMN[slot];
  const { data: before } = await supabase.from("profiles").select(column).eq("id", userId).single();
  const previous = (before as Record<string, string | null> | null)?.[column] ?? null;

  const patch = slot === "avatar" ? { avatar_path: path } : { banner_path: path };
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) return { ok: false, error: "We couldn't save this image. Please try again." };

  if (previous && previous !== path) await supabase.storage.from(BUCKET_FOR[slot]).remove([previous]);
  revalidatePath("/", "layout");
  return { ok: true, message: slot === "avatar" ? "Photo updated" : "Banner updated" };
}

export async function removeProfileImage(slot: ImageSlot): Promise<ActionState> {
  const { supabase, userId } = await currentUserId();
  if (!userId) return { ok: false, error: "Your session has expired. Log in again." };

  const column = COLUMN[slot];
  const { data: before } = await supabase.from("profiles").select(column).eq("id", userId).single();
  const previous = (before as Record<string, string | null> | null)?.[column] ?? null;

  const patch = slot === "avatar" ? { avatar_path: null } : { banner_path: null };
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) return { ok: false, error: "We couldn't remove this image. Please try again." };
  if (previous) await supabase.storage.from(BUCKET_FOR[slot]).remove([previous]);

  revalidatePath("/", "layout");
  return { ok: true, message: slot === "avatar" ? "Photo removed" : "Banner removed" };
}

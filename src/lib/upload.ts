import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export const RECIPE_IMAGES_BUCKET = "recipe-images";
export const STEP_IMAGES_BUCKET = "step-images";

export type UploadUrlResponse = {
  path: string;
  token: string;
  publicUrl: string;
};

/** Get signed upload URL from our API (small request, no file body). */
export async function getUploadUrl(
  bucket: string,
  path: string
): Promise<UploadUrlResponse> {
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ bucket, path }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<UploadUrlResponse>;
}

/** Upload file directly to Supabase using signed URL; returns public URL. File does not go through Vercel. */
export async function uploadFileToSupabase(
  bucket: string,
  path: string,
  file: File | Blob
): Promise<string> {
  const { path: returnedPath, token, publicUrl } = await getUploadUrl(bucket, path);
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(returnedPath, token, file);
  if (error) throw error;
  return publicUrl;
}

function getExtensionFromFile(file: File): string {
  const name = file.name.toLowerCase();
  const i = name.lastIndexOf(".");
  if (i >= 0) {
    const ext = name.slice(i + 1);
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  }
  const mime = file.type?.toLowerCase() ?? "";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

/** Build cover image path: recipeId/cover.{ext}. */
export function coverImagePath(recipeId: string, file: File): string {
  return `${recipeId}/cover.${getExtensionFromFile(file)}`;
}

/** Build step image path: recipeId/{sectionIdx}-{itemIdx}.{ext}. Use .jpg for consistency. */
export function stepImagePath(
  recipeId: string,
  sectionIdx: number,
  itemIdx: number,
  file: File
): string {
  const ext = getExtensionFromFile(file);
  return `${recipeId}/${sectionIdx}-${itemIdx}.${ext}`;
}

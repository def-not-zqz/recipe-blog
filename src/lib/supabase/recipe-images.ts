import sharp from "sharp";
import { createServerSupabaseClient } from "./server";
import type { Recipe } from "@/types/recipe";

const RECIPE_IMAGES_BUCKET = "recipe-images";
const STEP_IMAGES_BUCKET = "step-images";
const STEP_IMAGE_MAX_BYTES = 1024 * 1024; // 1MB
const STEP_IMAGE_MAX_WIDTH = 1280;
const STEP_IMAGE_MAX_HEIGHT = 720;

/** Thrown when a step image still exceeds 1MB after downsampling. API should return 400. */
export class StepImageTooLargeError extends Error {
  constructor() {
    super("步骤图不能超过 1MB");
    this.name = "StepImageTooLargeError";
  }
}

/**
 * Downsample a step image to max 720p and under 1MB. Returns JPEG buffer.
 */
async function downsampleStepImage(
  buffer: Buffer,
  _mime: string
): Promise<{ buffer: Buffer; mime: string }> {
  const resize = {
    width: STEP_IMAGE_MAX_WIDTH,
    height: STEP_IMAGE_MAX_HEIGHT,
    fit: "inside" as const,
    withoutEnlargement: true,
  };
  const qualities = [85, 70, 50, 35];
  for (const q of qualities) {
    const out = await sharp(buffer)
      .resize(resize)
      .jpeg({ quality: q })
      .toBuffer();
    if (out.length <= STEP_IMAGE_MAX_BYTES) {
      return { buffer: out, mime: "image/jpeg" };
    }
  }
  throw new StepImageTooLargeError();
}

function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime] ?? "jpg";
}

/**
 * Parse a data URL into MIME type and buffer.
 * Returns null if not a valid image data URL.
 */
function parseDataUrl(dataUrl: string): { mime: string; buffer: Buffer } | null {
  if (!dataUrl.startsWith("data:")) return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1].trim().toLowerCase();
  if (!mime.startsWith("image/")) return null;
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");
  return { mime, buffer };
}

function getPublicUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  const baseUrl = base.replace(/\/$/, "");
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Upload recipe cover and step images from data URLs to Supabase Storage,
 * replace image fields with public URLs. Skips entries that are already URLs.
 * Step images are auto-downsampled to max 720p and under 1MB before upload.
 * Throws StepImageTooLargeError only if a step image still exceeds 1MB after downsampling.
 */
export async function uploadRecipeImages(recipe: Recipe): Promise<Recipe> {
  const supabase = createServerSupabaseClient();
  const out: Recipe = { ...recipe, image: recipe.image, steps: recipe.steps.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) })) };

  // Cover image
  if (out.image?.startsWith("data:")) {
    const parsed = parseDataUrl(out.image);
    if (parsed) {
      const ext = getExtensionFromMime(parsed.mime);
      const path = `${recipe.id}/cover.${ext}`;
      const { error } = await supabase.storage.from(RECIPE_IMAGES_BUCKET).upload(path, parsed.buffer, {
        contentType: parsed.mime,
        upsert: true,
      });
      if (error) throw error;
      out.image = getPublicUrl(RECIPE_IMAGES_BUCKET, path);
    }
  }

  // Step images: always downsample to max 720p and under 1MB, then upload as JPEG
  for (let si = 0; si < out.steps.length; si++) {
    const section = out.steps[si];
    if (!section?.items) continue;
    for (let ii = 0; ii < section.items.length; ii++) {
      const item = section.items[ii];
      const image = item?.image;
      if (!image?.startsWith("data:")) continue;
      const parsed = parseDataUrl(image);
      if (!parsed) continue;
      const { buffer: stepBuffer, mime: stepMime } = await downsampleStepImage(
        parsed.buffer,
        parsed.mime
      );
      const ext = getExtensionFromMime(stepMime);
      const path = `${recipe.id}/${si}-${ii}.${ext}`;
      const { error } = await supabase.storage.from(STEP_IMAGES_BUCKET).upload(path, stepBuffer, {
        contentType: stepMime,
        upsert: true,
      });
      if (error) throw error;
      section.items[ii] = { ...item!, image: getPublicUrl(STEP_IMAGES_BUCKET, path) };
    }
  }

  return out;
}

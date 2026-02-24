export async function resizeImageFileToDataUrl(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = dataUrl;
  });

  const { width, height } = img;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  const targetWidth = Math.round(width * ratio);
  const targetHeight = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return canvas.toDataURL("image/jpeg", 0.85);
}


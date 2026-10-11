export interface ProcessedImageResult {
  blob: Blob;
  thumbnailBlob: Blob;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  format: 'image/webp' | 'image/jpeg';
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  thumbnailWidth?: number;
  thumbnailQuality?: number;
}

const DEFAULT_OPTIONS: ImageProcessingOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  thumbnailWidth: 400,
  thumbnailQuality: 0.75,
};

export async function processImageFile(
  file: File | Blob,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const originalSize = file.size;

  // If SVG, return as is (scalable vector doesn't need raster compression)
  if (file.type === 'image/svg+xml') {
    return {
      blob: file,
      thumbnailBlob: file,
      width: 800,
      height: 800,
      originalSize,
      compressedSize: originalSize,
      format: 'image/webp',
    };
  }

  // Load into HTMLImageElement
  const img = await loadImageFromBlob(file);
  const { width: origWidth, height: origHeight } = img;

  // Calculate main scaled dimensions
  let targetWidth = origWidth;
  let targetHeight = origHeight;
  const maxW = opts.maxWidth!;
  const maxH = opts.maxHeight!;

  if (targetWidth > maxW || targetHeight > maxH) {
    const ratio = Math.min(maxW / targetWidth, maxH / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  // Render main canvas
  const mainCanvas = document.createElement('canvas');
  mainCanvas.width = targetWidth;
  mainCanvas.height = targetHeight;
  const ctx = mainCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available');
  }

  // Smooth resampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Try WebP first, fallback to JPEG if not supported
  let mainBlob = await canvasToBlob(mainCanvas, 'image/webp', opts.quality);
  let chosenFormat: 'image/webp' | 'image/jpeg' = 'image/webp';

  if (!mainBlob || mainBlob.type !== 'image/webp') {
    mainBlob = await canvasToBlob(mainCanvas, 'image/jpeg', opts.quality);
    chosenFormat = 'image/jpeg';
  }

  if (!mainBlob) {
    throw new Error('Failed to encode image to blob');
  }

  // Calculate thumbnail dimensions
  const thumbW = opts.thumbnailWidth!;
  const thumbRatio = Math.min(1, thumbW / targetWidth);
  const thumbH = Math.round(targetHeight * thumbRatio);

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = Math.round(targetWidth * thumbRatio);
  thumbCanvas.height = thumbH;
  const thumbCtx = thumbCanvas.getContext('2d');
  if (thumbCtx) {
    thumbCtx.imageSmoothingEnabled = true;
    thumbCtx.imageSmoothingQuality = 'high';
    thumbCtx.drawImage(mainCanvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
  }

  const thumbBlob = (await canvasToBlob(thumbCanvas, chosenFormat, opts.thumbnailQuality)) || mainBlob;

  return {
    blob: mainBlob,
    thumbnailBlob: thumbBlob,
    width: targetWidth,
    height: targetHeight,
    originalSize,
    compressedSize: mainBlob.size,
    format: chosenFormat,
  };
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image into DOM: ' + String(e)));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

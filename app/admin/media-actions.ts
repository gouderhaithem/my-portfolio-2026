'use server'

import sharp from 'sharp'
import { getSession } from '@/lib/auth'
import { uploadImage, isCloudinaryConfigured } from '@/lib/cloudinary'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB (incoming file, before optimization)

// Downscale + re-encode settings. Cover images render at ~1100px wide, so 1600
// gives retina headroom while keeping files small. WebP at q80 is visually
// lossless for photos at a fraction of JPEG/PNG size.
const MAX_WIDTH = 1600
const WEBP_QUALITY = 80

// Allowed raster image types. SVG is intentionally excluded: it is XML that can
// carry <script>/event handlers and would be served as a stored-XSS vector from
// the Cloudinary CDN. Use raster formats for cover images.
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'] as const

/**
 * Sniffs the real MIME type from the file's magic bytes, ignoring the
 * client-supplied `File.type` (which is trivially spoofable). Returns null when
 * the bytes don't match a supported raster format.
 */
function detectImageMime(bytes: Buffer): (typeof ALLOWED)[number] | null {
  if (bytes.length < 12) return null
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png'
  }
  // GIF: "GIF87a" or "GIF89a"
  if (bytes.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/)) return 'image/gif'
  // RIFF .... WEBP
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp'
  }
  // ISO-BMFF (AVIF): "ftyp" at offset 4, brand "avif"/"avis"/"mif1"/"msf1"
  if (bytes.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = bytes.subarray(8, 12).toString('ascii')
    if (['avif', 'avis', 'mif1', 'msf1'].includes(brand)) return 'image/avif'
  }
  return null
}

export type UploadResult = { url: string; imageId: string } | { error: string }

/** Uploads an image on behalf of a signed-in admin. */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const session = await getSession()
  if (!session) return { error: 'Not authorized.' }
  if (!isCloudinaryConfigured) {
    return { error: 'Image uploads are not configured (missing Cloudinary keys).' }
  }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'No file selected.' }
  }
  if (file.size > MAX_BYTES) {
    return { error: 'File is too large (max 8 MB).' }
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  // Verify the actual bytes, not the client-declared content type.
  const mime = detectImageMime(bytes)
  if (!mime) {
    return { error: 'Unsupported or invalid image. Use JPG, PNG, WebP, AVIF, or GIF.' }
  }

  try {
    // Resize (cap width, never upscale) and re-encode to WebP. Re-encoding via
    // sharp also strips any embedded scripts/metadata, so what reaches
    // Cloudinary is a clean raster. Animated GIFs are preserved as animated WebP.
    const optimized = await sharp(bytes, { animated: mime === 'image/gif' })
      .rotate() // bake in EXIF orientation before stripping metadata
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer()

    return await uploadImage(optimized, 'image/webp')
  } catch (err) {
    console.error('[upload] failed:', err)
    return { error: 'Upload failed. Please try again.' }
  }
}

import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

// Server-side Cloudinary helper for the admin panel. Uploads use a signed
// request (API secret), so no unsigned preset is needed.

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

/** True when all Cloudinary credentials are present. */
export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret)

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export interface UploadedImage {
  /** Cloudinary secure_url, stored in the `image` column. */
  url: string
  /** Cloudinary public_id, stored in the `imageId` column (for deletion). */
  imageId: string
}

const FOLDER = 'portfolio'

/**
 * Uploads raw image bytes to Cloudinary and returns its url + public_id.
 * The MIME type must already be verified by the caller (see media-actions.ts)
 * — never trust a browser-supplied `File.type` here.
 */
export async function uploadImage(bytes: Buffer, mime: string): Promise<UploadedImage> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured (set CLOUDINARY_* env vars).')
  }
  const dataUri = `data:${mime};base64,${bytes.toString('base64')}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER,
    resource_type: 'image',
    overwrite: true,
  })
  return { url: result.secure_url, imageId: result.public_id }
}

/** Deletes an image from Cloudinary by public_id. Best-effort; never throws. */
export async function deleteImage(imageId: string | null | undefined): Promise<void> {
  if (!imageId || !isCloudinaryConfigured) return
  try {
    await cloudinary.uploader.destroy(imageId)
  } catch (err) {
    console.error('[cloudinary] failed to delete image:', imageId, err)
  }
}

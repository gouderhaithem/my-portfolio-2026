'use client'

import { useRef, useState, useTransition } from 'react'
import { uploadImageAction } from './media-actions'
import styles from './admin.module.css'

interface ImageFieldProps {
  /** Form field name for the URL (e.g. "image"). The id is `${name}Id`. */
  name: string
  label: string
  hint?: string
  defaultUrl?: string | null
  defaultImageId?: string | null
}

export default function ImageField({ name, label, hint, defaultUrl, defaultImageId }: ImageFieldProps) {
  const [url, setUrl] = useState(defaultUrl ?? '')
  const [imageId, setImageId] = useState(defaultImageId ?? '')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    const data = new FormData()
    data.set('file', file)
    startTransition(async () => {
      const result = await uploadImageAction(data)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setUrl(result.url)
      setImageId(result.imageId)
    })
  }

  function clear() {
    setUrl('')
    setImageId('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>
        {label}
        {hint ? <span className={styles.hint}> — {hint}</span> : null}
      </span>
      <input type="hidden" name={name} value={url} />
      <input type="hidden" name={`${name}Id`} value={imageId} />
      <div className={styles.imageField}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className={styles.imagePreview} />
        ) : (
          <div className={styles.imagePlaceholder}>No image</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={pending}
            style={{ fontSize: '0.85rem' }}
          />
          {pending ? <span className={styles.uploadStatus}>Uploading…</span> : null}
          {error ? <span className={styles.error}>{error}</span> : null}
          {url ? (
            <button type="button" className={styles.btnGhost} onClick={clear} style={{ alignSelf: 'flex-start' }}>
              Remove image
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

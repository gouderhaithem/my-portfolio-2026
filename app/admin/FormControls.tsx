'use client'

import { useFormStatus } from 'react-dom'
import styles from './admin.module.css'

export function SaveButton({ label = 'Save' }: { label?: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={styles.btn} disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  )
}

interface DeleteFormProps {
  action: (formData: FormData) => void | Promise<void>
  id: string
  label?: string
  confirmText?: string
}

export function DeleteForm({ action, id, label = 'Delete', confirmText }: DeleteFormProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText ?? 'Delete this item? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={`${styles.actionBtn} ${styles.actionDelete}`}>
        {label}
      </button>
    </form>
  )
}

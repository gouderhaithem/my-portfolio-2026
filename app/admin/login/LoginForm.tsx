'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { login, type LoginState } from './actions'
import styles from '../admin.module.css'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={styles.btn} disabled={pending} style={{ width: '100%', justifyContent: 'center' }}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {})
  const from = useSearchParams().get('from') ?? ''

  return (
    <form action={formAction} className={styles.form} style={{ gap: 16 }}>
      <input type="hidden" name="from" value={from} />
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={styles.input}
          placeholder="you@example.com"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
          placeholder="••••••••"
        />
      </div>
      <SubmitButton />
    </form>
  )
}

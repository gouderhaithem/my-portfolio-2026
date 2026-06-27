import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from './LoginForm'
import styles from '../admin.module.css'

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className={styles.root}>
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>
            Admin<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className={styles.loginSub}>Sign in to manage projects, posts, and services.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

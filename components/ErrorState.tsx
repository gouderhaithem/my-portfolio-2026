'use client'

import { useEffect } from 'react'
import SiteChrome from './SiteChrome'
import styles from './subpages.module.css'

interface ErrorStateProps {
  /** Human-readable context, e.g. "projects". */
  context?: string
  error: Error & { digest?: string }
  reset: () => void
}

/** Shared error boundary UI for the projects/blog/services route segments. */
export default function ErrorState({ context = 'this page', error, reset }: ErrorStateProps) {
  useEffect(() => {
    // Surface the error for server/edge logging; replace with your logger.
    console.error(error)
  }, [error])

  return (
    <SiteChrome>
      <div className={styles.container}>
        <div className={styles.stateWrap}>
          <span className="eyebrow">Something went wrong</span>
          <h1 className={styles.stateTitle}>We couldn&apos;t load {context}.</h1>
          <p className={styles.stateBody}>
            The content failed to load. This is usually temporary &mdash; please try again.
          </p>
          <button className="btn-pill primary" onClick={reset}>
            <span>Try again</span>
            <span className="arr">&rarr;</span>
          </button>
        </div>
      </div>
    </SiteChrome>
  )
}

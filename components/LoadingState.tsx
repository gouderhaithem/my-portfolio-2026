import SiteChrome from './SiteChrome'
import styles from './subpages.module.css'

/** Shared loading UI shown while a route segment's data resolves. */
export default function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <SiteChrome>
      <div className={styles.container}>
        <div className={styles.stateWrap}>
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.stateText}>{label}&hellip;</p>
        </div>
      </div>
    </SiteChrome>
  )
}

import ServiceForm from '../ServiceForm'
import styles from '../../../admin.module.css'

export default function NewServicePage() {
  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>New service</h1>
        </div>
      </div>
      <ServiceForm />
    </>
  )
}

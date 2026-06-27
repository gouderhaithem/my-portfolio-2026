import ProjectForm from '../ProjectForm'
import styles from '../../../admin.module.css'

export default function NewProjectPage() {
  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>New project</h1>
        </div>
      </div>
      <ProjectForm />
    </>
  )
}

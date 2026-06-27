import PostForm from '../PostForm'
import styles from '../../../admin.module.css'

export default function NewPostPage() {
  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>New post</h1>
        </div>
      </div>
      <PostForm />
    </>
  )
}

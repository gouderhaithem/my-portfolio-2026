import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PostForm from '../PostForm'
import styles from '../../../admin.module.css'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Edit post</h1>
          <p className={styles.pageSub}>{post.title}</p>
        </div>
      </div>
      <PostForm
        post={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          date: post.date,
          readingTime: post.readingTime,
          image: post.image,
          imageId: post.imageId,
          tags: post.tags,
          featured: post.featured,
          authorName: post.authorName,
          authorRole: post.authorRole,
          sections: post.sections,
          status: post.status,
        }}
      />
    </>
  )
}

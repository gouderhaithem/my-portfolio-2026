import type { Metadata } from 'next'
import SiteChrome from '@/components/SiteChrome'
import PostListRow from '@/components/PostListRow'
import { getPosts } from '@/lib/blog'
import styles from '@/components/subpages.module.css'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing on software engineering by Gouder Haithem — databases, performance, CRM and ERP architecture, and frontend craft.',
  alternates: { canonical: 'https://gouderhaithem.com/blog' },
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <SiteChrome>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="eyebrow">Writing</span>
          <h1 className={`display ${styles.title}`}>
            Notes on <span className="italic">building software</span>.
          </h1>
          <p className={styles.intro}>
            Essays on the engineering and product decisions behind the work — databases, performance,
            and the systems that quietly run businesses.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet. Check back soon.</p>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <PostListRow key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </SiteChrome>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SiteChrome from '@/components/SiteChrome'
import ContentSections from '@/components/ContentSections'
import PostListRow from '@/components/PostListRow'
import { Link } from '@/i18n/navigation'
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/blog'
import { formatDate } from '@/lib/format'
import { localeAlternates, localeUrl } from '@/lib/seo'
import styles from '@/components/subpages.module.css'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    const t = await getTranslations({ locale, namespace: 'blogPage' })
    return { title: t('notFound') }
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: localeUrl(locale, `/blog/${post.slug}`),
      languages: localeAlternates(`/blog/${post.slug}`),
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      // OG image is generated dynamically — see ./opengraph-image.tsx
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const t = await getTranslations('blogPage')
  const related = await getRelatedPosts(slug)

  const initials = post.author.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <SiteChrome>
      <div className={`${styles.container} ${styles.containerNarrow}`}>
        <Link href="/blog" className={styles.back}>
          <span className="arr">&larr;</span>
          <span>{t('back')}</span>
        </Link>

        <header className={styles.detailHead}>
          <span className="eyebrow">{post.category}</span>
          <h1 className={`display ${styles.detailTitle}`}>{post.title}</h1>
          <p className={styles.detailSummary}>{post.excerpt}</p>
          <div className={styles.detailMetaRow}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime}</span>
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </header>

        <div className={styles.articleMeta}>
          <span className={styles.avatar}>{initials}</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className={styles.authorName}>{post.author.name}</span>
            <span className={styles.authorRole}>{post.author.role}</span>
          </span>
        </div>

        {post.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={styles.heroImage} src={post.image} alt={post.title} />
        )}

        <ContentSections sections={post.sections} />

        {related.length > 0 && (
          <div className={styles.related}>
            <span className="eyebrow">{t('keepReading')}</span>
            <h2 className={styles.relatedTitle}>{t('relatedTitle')}</h2>
            <div className={styles.postList}>
              {related.map((item) => (
                <PostListRow key={item.slug} post={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteChrome>
  )
}

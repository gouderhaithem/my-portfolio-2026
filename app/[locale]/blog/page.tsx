import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SiteChrome from '@/components/SiteChrome'
import PostListRow from '@/components/PostListRow'
import { getPosts } from '@/lib/blog'
import { localeAlternates, localeUrl } from '@/lib/seo'
import styles from '@/components/subpages.module.css'

const richTitle = {
  i: (chunks: React.ReactNode) => <span className="italic">{chunks}</span>,
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blogPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: localeUrl(locale, '/blog'),
      languages: localeAlternates('/blog'),
    },
  }
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = await getPosts()
  const t = await getTranslations('blogPage')

  return (
    <SiteChrome>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className={`display ${styles.title}`}>{t.rich('title', richTitle)}</h1>
          <p className={styles.intro}>{t('intro')}</p>
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
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

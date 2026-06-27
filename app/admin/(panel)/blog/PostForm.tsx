'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { savePost, type FormState } from './actions'
import { SaveButton } from '../../FormControls'
import AiAssist from '../../AiAssist'
import ImageField from '../../ImageField'
import styles from '../../admin.module.css'

export interface PostFormData {
  id?: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: string
  image?: string | null
  imageId?: string | null
  tags: string[]
  featured: boolean
  authorName: string
  authorRole: string
  sections: unknown
  status: string
}

const SECTIONS_PLACEHOLDER = `[
  {
    "heading": "Optional heading",
    "paragraphs": ["A paragraph of body copy."],
    "bullets": ["Optional bullet"],
    "quote": "Optional pull-quote"
  }
]`

export default function PostForm({ post }: { post?: PostFormData }) {
  const [state, formAction] = useActionState<FormState, FormData>(savePost, {})

  return (
    <form action={formAction} className={styles.form}>
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      {state.error ? <p className={styles.error}>{state.error}</p> : null}

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <AiAssist
            targetId="title"
            contentType="blog post"
            field="title"
            context={[
              { label: 'excerpt', id: 'excerpt' },
              { label: 'category', id: 'category' },
            ]}
          />
        </div>
        <input id="title" name="title" className={styles.input} defaultValue={post?.title} required />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">
            Slug <span className={styles.hint}>auto from title if blank</span>
          </label>
          <input id="slug" name="slug" className={`${styles.input} ${styles.mono}`} defaultValue={post?.slug} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            Category
          </label>
          <input id="category" name="category" className={styles.input} defaultValue={post?.category} required />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="date">
            Date <span className={styles.hint}>ISO, e.g. 2026-05-18</span>
          </label>
          <input id="date" name="date" className={styles.input} defaultValue={post?.date} placeholder="2026-05-18" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="readingTime">
            Reading time
          </label>
          <input id="readingTime" name="readingTime" className={styles.input} defaultValue={post?.readingTime} placeholder="7 min read" required />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="excerpt">
            Excerpt
          </label>
          <AiAssist
            targetId="excerpt"
            contentType="blog post"
            field="excerpt"
            context={[
              { label: 'title', id: 'title' },
              { label: 'category', id: 'category' },
            ]}
          />
        </div>
        <textarea id="excerpt" name="excerpt" className={styles.textarea} defaultValue={post?.excerpt} required />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="authorName">
            Author name
          </label>
          <input id="authorName" name="authorName" className={styles.input} defaultValue={post?.authorName ?? 'Gouder Haithem'} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="authorRole">
            Author role
          </label>
          <input id="authorRole" name="authorRole" className={styles.input} defaultValue={post?.authorRole ?? 'Software Engineer'} required />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="tags">
            Tags <span className={styles.hint}>one per line</span>
          </label>
          <AiAssist
            targetId="tags"
            contentType="blog post"
            field="tags"
            format="lines"
            context={[
              { label: 'title', id: 'title' },
              { label: 'excerpt', id: 'excerpt' },
            ]}
          />
        </div>
        <textarea id="tags" name="tags" className={styles.textarea} defaultValue={post?.tags.join('\n')} rows={4} />
      </div>

      <ImageField
        name="image"
        label="Cover image"
        hint="uploaded to Cloudinary"
        defaultUrl={post?.image}
        defaultImageId={post?.imageId}
      />

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="sections">
            Sections <span className={styles.hint}>JSON array of content blocks</span>
          </label>
          <AiAssist
            targetId="sections"
            contentType="blog post"
            field="article body"
            format="sections"
            context={[
              { label: 'title', id: 'title' },
              { label: 'excerpt', id: 'excerpt' },
              { label: 'category', id: 'category' },
            ]}
          />
        </div>
        <textarea
          id="sections"
          name="sections"
          className={`${styles.textarea} ${styles.mono}`}
          defaultValue={post?.sections ? JSON.stringify(post.sections, null, 2) : ''}
          placeholder={SECTIONS_PLACEHOLDER}
          rows={14}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="status">
          Status
        </label>
        <select id="status" name="status" className={styles.select} defaultValue={post?.status ?? 'draft'}>
          <option value="draft">Draft — hidden from the site</option>
          <option value="published">Published — visible on the site</option>
        </select>
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" name="featured" defaultChecked={post?.featured} />
        Feature on the home page
      </label>

      <div className={styles.formActions}>
        <SaveButton label={post?.id ? 'Save changes' : 'Create post'} />
        <Link href="/admin/blog" className={styles.btnGhost}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

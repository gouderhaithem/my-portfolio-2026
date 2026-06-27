'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { saveProject, type FormState } from './actions'
import { SaveButton } from '../../FormControls'
import AiAssist from '../../AiAssist'
import ImageField from '../../ImageField'
import styles from '../../admin.module.css'

export interface ProjectFormData {
  id?: string
  slug: string
  title: string
  tagline: string
  category: string
  year: string
  cover: [string, string]
  image?: string | null
  imageId?: string | null
  tags: string[]
  featured: boolean
  client: string
  role: string
  timeline: string
  stack: string[]
  liveUrl?: string | null
  repoUrl?: string | null
  summary: string
  sections: unknown
  results: unknown
  gallery: string[]
  status: string
}

const SECTIONS_PLACEHOLDER = `[
  {
    "heading": "The problem",
    "paragraphs": ["Body copy."],
    "bullets": ["Optional bullet"],
    "quote": "Optional pull-quote"
  }
]`

const RESULTS_PLACEHOLDER = `[
  { "label": "Latency", "value": "12× faster" },
  { "label": "Daily users", "value": "600+" }
]`

export default function ProjectForm({ project }: { project?: ProjectFormData }) {
  const [state, formAction] = useActionState<FormState, FormData>(saveProject, {})

  return (
    <form action={formAction} className={styles.form}>
      {project?.id ? <input type="hidden" name="id" value={project.id} /> : null}
      {state.error ? <p className={styles.error}>{state.error}</p> : null}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" className={styles.input} defaultValue={project?.title} required />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="tagline">
            Tagline
          </label>
          <AiAssist
            targetId="tagline"
            contentType="project"
            field="tagline"
            context={[
              { label: 'title', id: 'title' },
              { label: 'category', id: 'category' },
              { label: 'summary', id: 'summary' },
            ]}
          />
        </div>
        <input id="tagline" name="tagline" className={styles.input} defaultValue={project?.tagline} required />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">
            Slug <span className={styles.hint}>auto from title if blank</span>
          </label>
          <input id="slug" name="slug" className={`${styles.input} ${styles.mono}`} defaultValue={project?.slug} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            Category
          </label>
          <input id="category" name="category" className={styles.input} defaultValue={project?.category} required />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="year">
            Year
          </label>
          <input id="year" name="year" className={styles.input} defaultValue={project?.year} placeholder="2025" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="timeline">
            Timeline
          </label>
          <input id="timeline" name="timeline" className={styles.input} defaultValue={project?.timeline} placeholder="8 months" required />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client">
            Client
          </label>
          <input id="client" name="client" className={styles.input} defaultValue={project?.client} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="role">
            Role
          </label>
          <input id="role" name="role" className={styles.input} defaultValue={project?.role} placeholder="Lead Engineer" required />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="liveUrl">
            Live URL <span className={styles.hint}>optional</span>
          </label>
          <input id="liveUrl" name="liveUrl" className={styles.input} defaultValue={project?.liveUrl ?? ''} type="url" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="repoUrl">
            Repo URL <span className={styles.hint}>optional</span>
          </label>
          <input id="repoUrl" name="repoUrl" className={styles.input} defaultValue={project?.repoUrl ?? ''} type="url" />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="coverFrom">
            Cover gradient — from
          </label>
          <input id="coverFrom" name="coverFrom" className={`${styles.input} ${styles.mono}`} defaultValue={project?.cover?.[0] ?? '#7c5cff'} placeholder="#7c5cff" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="coverTo">
            Cover gradient — to
          </label>
          <input id="coverTo" name="coverTo" className={`${styles.input} ${styles.mono}`} defaultValue={project?.cover?.[1] ?? '#3a2a8c'} placeholder="#3a2a8c" />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="tags">
          Tags <span className={styles.hint}>one per line</span>
        </label>
        <textarea id="tags" name="tags" className={styles.textarea} defaultValue={project?.tags.join('\n')} rows={4} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="stack">
          Tech stack <span className={styles.hint}>one per line</span>
        </label>
        <textarea id="stack" name="stack" className={styles.textarea} defaultValue={project?.stack.join('\n')} rows={4} />
      </div>

      <ImageField
        name="image"
        label="Cover image"
        hint="uploaded to Cloudinary"
        defaultUrl={project?.image}
        defaultImageId={project?.imageId}
      />

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="summary">
            Summary
          </label>
          <AiAssist
            targetId="summary"
            contentType="project"
            field="summary"
            context={[
              { label: 'title', id: 'title' },
              { label: 'tagline', id: 'tagline' },
              { label: 'category', id: 'category' },
              { label: 'stack', id: 'stack' },
            ]}
          />
        </div>
        <textarea id="summary" name="summary" className={styles.textarea} defaultValue={project?.summary} required />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="sections">
            Sections <span className={styles.hint}>JSON array of content blocks</span>
          </label>
          <AiAssist
            targetId="sections"
            contentType="project"
            field="case study body"
            format="sections"
            context={[
              { label: 'title', id: 'title' },
              { label: 'tagline', id: 'tagline' },
              { label: 'summary', id: 'summary' },
              { label: 'stack', id: 'stack' },
            ]}
          />
        </div>
        <textarea
          id="sections"
          name="sections"
          className={`${styles.textarea} ${styles.mono}`}
          defaultValue={project?.sections ? JSON.stringify(project.sections, null, 2) : ''}
          placeholder={SECTIONS_PLACEHOLDER}
          rows={14}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="results">
          Results <span className={styles.hint}>JSON array of {'{ label, value }'}</span>
        </label>
        <textarea
          id="results"
          name="results"
          className={`${styles.textarea} ${styles.mono}`}
          defaultValue={project?.results ? JSON.stringify(project.results, null, 2) : ''}
          placeholder={RESULTS_PLACEHOLDER}
          rows={8}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="gallery">
          Gallery image URLs <span className={styles.hint}>one per line, optional</span>
        </label>
        <textarea id="gallery" name="gallery" className={`${styles.textarea} ${styles.mono}`} defaultValue={project?.gallery.join('\n')} rows={4} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="status">
          Status
        </label>
        <select id="status" name="status" className={styles.select} defaultValue={project?.status ?? 'draft'}>
          <option value="draft">Draft — hidden from the site</option>
          <option value="published">Published — visible on the site</option>
        </select>
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" name="featured" defaultChecked={project?.featured} />
        Feature on the home page
      </label>

      <div className={styles.formActions}>
        <SaveButton label={project?.id ? 'Save changes' : 'Create project'} />
        <Link href="/admin/projects" className={styles.btnGhost}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

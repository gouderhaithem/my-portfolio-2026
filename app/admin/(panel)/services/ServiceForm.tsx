'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { saveService, type FormState } from './actions'
import { SaveButton } from '../../FormControls'
import AiAssist from '../../AiAssist'
import styles from '../../admin.module.css'

export interface ServiceFormData {
  id?: string
  slug: string
  num: string
  title: string
  titleAccent: string
  icon: string
  summary: string
  features: string[]
  featured: boolean
  order: number
  status: string
}

const ICONS = ['web', 'crm', 'erp', 'api', 'audit', 'support']

export default function ServiceForm({ service }: { service?: ServiceFormData }) {
  const [state, formAction] = useActionState<FormState, FormData>(saveService, {})

  return (
    <form action={formAction} className={styles.form}>
      {service?.id ? <input type="hidden" name="id" value={service.id} /> : null}
      {state.error ? <p className={styles.error}>{state.error}</p> : null}

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <input id="title" name="title" className={styles.input} defaultValue={service?.title} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="titleAccent">
            Title accent <span className={styles.hint}>italic suffix, e.g. “& web apps”</span>
          </label>
          <input id="titleAccent" name="titleAccent" className={styles.input} defaultValue={service?.titleAccent} />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">
            Slug <span className={styles.hint}>auto-generated from title if blank</span>
          </label>
          <input id="slug" name="slug" className={`${styles.input} ${styles.mono}`} defaultValue={service?.slug} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="num">
            Number label <span className={styles.hint}>e.g. “S · 01”</span>
          </label>
          <input id="num" name="num" className={styles.input} defaultValue={service?.num} required />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="icon">
            Icon
          </label>
          <select id="icon" name="icon" className={styles.select} defaultValue={service?.icon ?? 'web'}>
            {ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="order">
            Display order <span className={styles.hint}>lower shows first</span>
          </label>
          <input id="order" name="order" type="number" className={styles.input} defaultValue={service?.order ?? 0} />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="summary">
            Summary
          </label>
          <AiAssist
            targetId="summary"
            contentType="service"
            field="summary"
            context={[
              { label: 'title', id: 'title' },
              { label: 'title accent', id: 'titleAccent' },
            ]}
          />
        </div>
        <textarea id="summary" name="summary" className={styles.textarea} defaultValue={service?.summary} required />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="features">
            Features <span className={styles.hint}>one per line</span>
          </label>
          <AiAssist
            targetId="features"
            contentType="service"
            field="features"
            format="lines"
            context={[
              { label: 'title', id: 'title' },
              { label: 'summary', id: 'summary' },
            ]}
          />
        </div>
        <textarea
          id="features"
          name="features"
          className={styles.textarea}
          defaultValue={service?.features.join('\n')}
          rows={5}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="status">
          Status
        </label>
        <select id="status" name="status" className={styles.select} defaultValue={service?.status ?? 'draft'}>
          <option value="draft">Draft — hidden from the site</option>
          <option value="published">Published — visible on the site</option>
        </select>
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" name="featured" defaultChecked={service?.featured} />
        Feature on the home page
      </label>

      <div className={styles.formActions}>
        <SaveButton label={service?.id ? 'Save changes' : 'Create service'} />
        <Link href="/admin/services" className={styles.btnGhost}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

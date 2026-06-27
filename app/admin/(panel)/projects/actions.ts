'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'
import { contentSectionsSchema, resultsSchema } from '@/lib/schemas'
import { str, lines, bool, json, slugify } from '@/lib/admin-form'

export interface FormState {
  error?: string
}

const projectSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
  title: z.string().min(1, 'Title is required.'),
  tagline: z.string().min(1, 'Tagline is required.'),
  category: z.string().min(1, 'Category is required.'),
  year: z.string().min(1, 'Year is required.'),
  cover: z.array(z.string()).length(2),
  image: z.string().optional(),
  imageId: z.string().optional(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  client: z.string().min(1, 'Client is required.'),
  role: z.string().min(1, 'Role is required.'),
  timeline: z.string().min(1, 'Timeline is required.'),
  stack: z.array(z.string()),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  summary: z.string().min(1, 'Summary is required.'),
  gallery: z.array(z.string()),
  status: z.enum(['draft', 'published']),
})

function revalidatePublic(slug?: string) {
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/projects/${slug}`)
}

export async function saveProject(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!(await getSession())) return { error: 'Not authorized.' }

  const id = str(fd, 'id')
  const title = str(fd, 'title')

  const [sections, sectionsErr] = json(str(fd, 'sections'), 'Sections')
  if (sectionsErr) return { error: sectionsErr }
  const sectionsParsed = contentSectionsSchema.safeParse(sections)
  if (!sectionsParsed.success) {
    return { error: 'Sections JSON does not match the expected shape (heading/paragraphs/bullets/quote).' }
  }

  const [results, resultsErr] = json(str(fd, 'results'), 'Results')
  if (resultsErr) return { error: resultsErr }
  const resultsParsed = resultsSchema.safeParse(results)
  if (!resultsParsed.success) {
    return { error: 'Results JSON must be an array of { "label": "...", "value": "..." }.' }
  }

  const parsed = projectSchema.safeParse({
    slug: str(fd, 'slug') || slugify(title),
    title,
    tagline: str(fd, 'tagline'),
    category: str(fd, 'category'),
    year: str(fd, 'year'),
    cover: [str(fd, 'coverFrom') || '#7c5cff', str(fd, 'coverTo') || '#3a2a8c'],
    image: str(fd, 'image') || undefined,
    imageId: str(fd, 'imageId') || undefined,
    tags: lines(fd, 'tags'),
    featured: bool(fd, 'featured'),
    client: str(fd, 'client'),
    role: str(fd, 'role'),
    timeline: str(fd, 'timeline'),
    stack: lines(fd, 'stack'),
    liveUrl: str(fd, 'liveUrl') || undefined,
    repoUrl: str(fd, 'repoUrl') || undefined,
    summary: str(fd, 'summary'),
    gallery: lines(fd, 'gallery'),
    status: str(fd, 'status') === 'published' ? 'published' : 'draft',
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }

  const data = {
    ...parsed.data,
    image: parsed.data.image ?? null,
    imageId: parsed.data.imageId ?? null,
    liveUrl: parsed.data.liveUrl ?? null,
    repoUrl: parsed.data.repoUrl ?? null,
    sections: sectionsParsed.data as unknown as Prisma.InputJsonValue,
    results: resultsParsed.data as unknown as Prisma.InputJsonValue,
  }

  try {
    if (id) {
      const existing = await prisma.project.findUnique({ where: { id }, select: { imageId: true } })
      if (existing?.imageId && existing.imageId !== data.imageId) {
        await deleteImage(existing.imageId)
      }
      await prisma.project.update({ where: { id }, data })
    } else {
      await prisma.project.create({ data })
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return { error: 'A project with that slug already exists.' }
    }
    console.error('[projects] save failed:', err)
    return { error: 'Could not save. Please try again.' }
  }

  revalidatePublic(parsed.data.slug)
  redirect('/admin/projects')
}

export async function deleteProject(fd: FormData): Promise<void> {
  if (!(await getSession())) {
    console.warn('[projects] unauthenticated delete attempt')
    return
  }
  const id = str(fd, 'id')
  if (!id) return
  try {
    const project = await prisma.project.findUnique({ where: { id }, select: { imageId: true } })
    await prisma.project.delete({ where: { id } })
    await deleteImage(project?.imageId)
  } catch (err) {
    console.error('[projects] delete failed:', err)
  }
  revalidatePublic()
  revalidatePath('/admin/projects')
}

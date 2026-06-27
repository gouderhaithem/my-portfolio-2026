'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { str, lines, bool, int, slugify } from '@/lib/admin-form'

export interface FormState {
  error?: string
}

const ICONS = ['web', 'crm', 'erp', 'api', 'audit', 'support'] as const

const serviceSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
  num: z.string().min(1, 'Number label is required.'),
  title: z.string().min(1, 'Title is required.'),
  titleAccent: z.string(),
  icon: z.enum(ICONS),
  summary: z.string().min(1, 'Summary is required.'),
  features: z.array(z.string()),
  featured: z.boolean(),
  order: z.number().int(),
  status: z.enum(['draft', 'published']),
})

function revalidatePublic() {
  revalidatePath('/')
  revalidatePath('/services')
  revalidatePath('/sitemap.xml')
}

export async function saveService(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!(await getSession())) return { error: 'Not authorized.' }

  const id = str(fd, 'id')
  const title = str(fd, 'title')
  const parsed = serviceSchema.safeParse({
    slug: str(fd, 'slug') || slugify(title),
    num: str(fd, 'num'),
    title,
    titleAccent: str(fd, 'titleAccent'),
    icon: str(fd, 'icon'),
    summary: str(fd, 'summary'),
    features: lines(fd, 'features'),
    featured: bool(fd, 'featured'),
    order: int(fd, 'order', 0),
    status: str(fd, 'status') === 'published' ? 'published' : 'draft',
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }

  try {
    if (id) {
      await prisma.service.update({ where: { id }, data: parsed.data })
    } else {
      await prisma.service.create({ data: parsed.data })
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return { error: 'A service with that slug already exists.' }
    }
    console.error('[services] save failed:', err)
    return { error: 'Could not save. Please try again.' }
  }

  revalidatePublic()
  redirect('/admin/services')
}

export async function deleteService(fd: FormData): Promise<void> {
  if (!(await getSession())) {
    console.warn('[services] unauthenticated delete attempt')
    return
  }
  const id = str(fd, 'id')
  if (!id) return
  try {
    await prisma.service.delete({ where: { id } })
  } catch (err) {
    console.error('[services] delete failed:', err)
  }
  revalidatePublic()
  revalidatePath('/admin/services')
}

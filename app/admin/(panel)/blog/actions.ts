'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'
import { contentSectionsSchema } from '@/lib/schemas'
import { str, lines, bool, json, slugify } from '@/lib/admin-form'

export interface FormState {
  error?: string
}

const postSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
  title: z.string().min(1, 'Title is required.'),
  excerpt: z.string().min(1, 'Excerpt is required.'),
  category: z.string().min(1, 'Category is required.'),
  date: z.string().min(1, 'Date is required.'),
  readingTime: z.string().min(1, 'Reading time is required.'),
  image: z.string().optional(),
  imageId: z.string().optional(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  authorName: z.string().min(1, 'Author name is required.'),
  authorRole: z.string().min(1, 'Author role is required.'),
  status: z.enum(['draft', 'published']),
})

function revalidatePublic(slug?: string) {
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/blog/${slug}`)
}

export async function savePost(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!(await getSession())) return { error: 'Not authorized.' }

  const id = str(fd, 'id')
  const title = str(fd, 'title')

  const [sections, sectionsErr] = json(str(fd, 'sections'), 'Sections')
  if (sectionsErr) return { error: sectionsErr }
  const sectionsParsed = contentSectionsSchema.safeParse(sections)
  if (!sectionsParsed.success) {
    return { error: 'Sections JSON does not match the expected shape (heading/paragraphs/bullets/quote).' }
  }

  const parsed = postSchema.safeParse({
    slug: str(fd, 'slug') || slugify(title),
    title,
    excerpt: str(fd, 'excerpt'),
    category: str(fd, 'category'),
    date: str(fd, 'date'),
    readingTime: str(fd, 'readingTime'),
    image: str(fd, 'image') || undefined,
    imageId: str(fd, 'imageId') || undefined,
    tags: lines(fd, 'tags'),
    featured: bool(fd, 'featured'),
    authorName: str(fd, 'authorName'),
    authorRole: str(fd, 'authorRole'),
    status: str(fd, 'status') === 'published' ? 'published' : 'draft',
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' }

  const data = {
    ...parsed.data,
    image: parsed.data.image ?? null,
    imageId: parsed.data.imageId ?? null,
    sections: sectionsParsed.data as unknown as Prisma.InputJsonValue,
  }

  try {
    if (id) {
      // If the image changed, clean up the old Cloudinary asset.
      const existing = await prisma.post.findUnique({ where: { id }, select: { imageId: true } })
      if (existing?.imageId && existing.imageId !== data.imageId) {
        await deleteImage(existing.imageId)
      }
      await prisma.post.update({ where: { id }, data })
    } else {
      await prisma.post.create({ data })
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return { error: 'A post with that slug already exists.' }
    }
    console.error('[blog] save failed:', err)
    return { error: 'Could not save. Please try again.' }
  }

  revalidatePublic(parsed.data.slug)
  redirect('/admin/blog')
}

export async function deletePost(fd: FormData): Promise<void> {
  if (!(await getSession())) {
    console.warn('[blog] unauthenticated delete attempt')
    return
  }
  const id = str(fd, 'id')
  if (!id) return
  try {
    const post = await prisma.post.findUnique({ where: { id }, select: { imageId: true } })
    await prisma.post.delete({ where: { id } })
    await deleteImage(post?.imageId)
  } catch (err) {
    console.error('[blog] delete failed:', err)
  }
  revalidatePublic()
  revalidatePath('/admin/blog')
}

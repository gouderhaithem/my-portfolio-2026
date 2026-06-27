import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { mockProjects } from '../lib/projects'
import { mockPosts } from '../lib/blog'
import { mockServices } from '../lib/services'

const prisma = new PrismaClient()

async function seedProjects() {
  for (const p of mockProjects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        tagline: p.tagline,
        category: p.category,
        year: p.year,
        cover: p.cover,
        image: p.image ?? null,
        tags: p.tags,
        featured: p.featured ?? false,
        client: p.client,
        role: p.role,
        timeline: p.timeline,
        stack: p.stack,
        liveUrl: p.liveUrl ?? null,
        repoUrl: p.repoUrl ?? null,
        summary: p.summary,
        sections: p.sections as unknown as Prisma.InputJsonValue,
        results: p.results as unknown as Prisma.InputJsonValue,
        gallery: p.gallery ?? [],
        status: 'published',
      },
    })
  }
  console.log(`  ✓ ${mockProjects.length} projects`)
}

async function seedPosts() {
  for (const p of mockPosts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        date: p.date,
        readingTime: p.readingTime,
        image: p.image ?? null,
        tags: p.tags,
        featured: p.featured ?? false,
        authorName: p.author.name,
        authorRole: p.author.role,
        sections: p.sections as unknown as Prisma.InputJsonValue,
        status: 'published',
      },
    })
  }
  console.log(`  ✓ ${mockPosts.length} posts`)
}

async function seedServices() {
  for (const [i, s] of mockServices.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        num: s.num,
        title: s.title,
        titleAccent: s.titleAccent,
        icon: s.icon,
        summary: s.summary,
        features: s.features,
        featured: s.featured ?? false,
        order: i,
        status: 'published',
      },
    })
  }
  console.log(`  ✓ ${mockServices.length} services`)
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    console.log('  • Skipped admin user (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)')
    return
  }
  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: 'Admin', role: 'admin' },
  })
  console.log(`  ✓ admin user (${email})`)
}

async function main() {
  console.log('Seeding database…')
  await seedProjects()
  await seedPosts()
  await seedServices()
  await seedAdmin()
  console.log('Done.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

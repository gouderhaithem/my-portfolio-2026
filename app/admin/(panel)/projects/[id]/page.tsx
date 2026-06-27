import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProjectForm from '../ProjectForm'
import styles from '../../../admin.module.css'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) notFound()

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Edit project</h1>
          <p className={styles.pageSub}>{project.title}</p>
        </div>
      </div>
      <ProjectForm
        project={{
          id: project.id,
          slug: project.slug,
          title: project.title,
          tagline: project.tagline,
          category: project.category,
          year: project.year,
          cover: [project.cover[0] ?? '#7c5cff', project.cover[1] ?? '#3a2a8c'],
          image: project.image,
          imageId: project.imageId,
          tags: project.tags,
          featured: project.featured,
          client: project.client,
          role: project.role,
          timeline: project.timeline,
          stack: project.stack,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
          summary: project.summary,
          sections: project.sections,
          results: project.results,
          gallery: project.gallery,
          status: project.status,
        }}
      />
    </>
  )
}

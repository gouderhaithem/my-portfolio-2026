import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ServiceForm from '../ServiceForm'
import styles from '../../../admin.module.css'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) notFound()

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Edit service</h1>
          <p className={styles.pageSub}>{service.title}</p>
        </div>
      </div>
      <ServiceForm
        service={{
          id: service.id,
          slug: service.slug,
          num: service.num,
          title: service.title,
          titleAccent: service.titleAccent,
          icon: service.icon,
          summary: service.summary,
          features: service.features,
          featured: service.featured,
          order: service.order,
          status: service.status,
        }}
      />
    </>
  )
}

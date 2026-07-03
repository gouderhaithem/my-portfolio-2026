import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/projects'

// Node runtime (not edge): the project is fetched through Prisma, which does
// not run on the edge. ImageResponse is supported in the Node.js runtime too.
export const alt = 'Gouder Haithem — Project'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  const title = project?.title ?? 'Gouder Haithem'
  const category = project?.category ?? 'Case Study'
  const tagline = project?.tagline

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a78cff, #7c5cff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: '#fff',
            }}
          >
            GH
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#7c5cff',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {category}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 700,
              color: '#f5f5f7',
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          {tagline ? (
            <div style={{ display: 'flex', fontSize: 30, color: '#b8b8c4', lineHeight: 1.3 }}>
              {tagline}
            </div>
          ) : null}
        </div>

        <div style={{ fontSize: 26, color: '#9a9aa6' }}>
          Gouder Haithem · Software Engineer
        </div>
      </div>
    ),
    { ...size }
  )
}

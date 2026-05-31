import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Gouder Haithem — Software Engineer in Algeria'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a78cff, #7c5cff)',
            marginBottom: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            color: '#fff',
          }}
        >
          GH
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, color: '#f5f5f7', marginBottom: 16 }}>
          Gouder Haithem
        </div>
        <div style={{ fontSize: 28, color: '#7c5cff', fontStyle: 'italic', marginBottom: 24 }}>
          Software Engineer
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#9a9aa6',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Algiers · Algeria · Remote
        </div>
      </div>
    ),
    { ...size }
  )
}

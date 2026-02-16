import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '上弦動物生技 — 專業動物醫療設備與耗材'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: '1px solid rgba(199, 171, 121, 0.3)',
            display: 'flex',
          }}
        />

        {/* Accent line */}
        <div
          style={{
            width: 80,
            height: 2,
            backgroundColor: '#c7ab79',
            marginBottom: 24,
            display: 'flex',
          }}
        />

        {/* Company name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#fafafa',
            letterSpacing: '0.05em',
            display: 'flex',
          }}
        >
          上弦動物生技
        </div>

        {/* English subtitle */}
        <div
          style={{
            fontSize: 20,
            color: '#c7ab79',
            letterSpacing: '0.3em',
            textTransform: 'uppercase' as const,
            marginTop: 16,
            display: 'flex',
          }}
        >
          Shangxian Animal Biotech
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: '#a1a1aa',
            marginTop: 32,
            display: 'flex',
          }}
        >
          專業動物醫療設備與耗材
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            width: 40,
            height: 2,
            backgroundColor: '#c7ab79',
            marginTop: 32,
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}

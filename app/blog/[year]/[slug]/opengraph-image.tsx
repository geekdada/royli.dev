import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/content/posts'
import { getNotoSansSCBold } from '@/lib/og/fonts'

export const runtime = 'nodejs'
export const revalidate = 604800 // Cache for 7 days
export const alt = 'Blog post cover image'
export const size = {
  width: 1600,
  height: 840,
}
export const contentType = 'image/png'

interface Props {
  params: Promise<{ year: string; slug: string }>
}

export default async function Image({ params }: Props) {
  const { year, slug } = await params
  const post = await getPostBySlug(slug, year)
  const font = await getNotoSansSCBold()

  if (!post) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fafafa, #f0f0f0)',
        }}
      >
        <span style={{ fontSize: 64, fontWeight: 'bold', color: '#0751cf' }}>
          royli.dev
        </span>
      </div>,
      {
        ...size,
        fonts: [
          { name: 'NotoSansSC', data: font, style: 'normal', weight: 700 },
        ],
      }
    )
  }

  const publishDate = new Date(post.publishDate)
  const formattedDate = publishDate.toISOString().slice(0, 10)

  const titleLength = post.title.length
  const titleFontSize = titleLength > 30 ? 64 : 74

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 80,
        paddingTop: 100,
        background: '#f8f8f0',
        position: 'relative',
      }}
    >
      {/* Dot matrix pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(100, 120, 160, 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Horizontal scan lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.02) 50%)',
          backgroundSize: '100% 8px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {post.coverIcon && (
          <span style={{ fontSize: 96, marginBottom: 42 }}>
            {post.coverIcon}
          </span>
        )}

        <span
          style={{
            fontSize: titleFontSize,
            fontWeight: 700,
            color: '#0751cf',
            lineHeight: 1.2,
            textShadow: '0.5px 0 0 #0751cf, -0.5px 0 0 #0751cf',
            marginBottom: 16,
            textWrap: 'balance',
          }}
        >
          {post.title}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 37,
            fontWeight: 700,
            color: '#0751cf',
            textShadow: '0.5px 0 0 #0751cf, -0.5px 0 0 #0751cf',
          }}
        >
          royli.dev
        </span>
        <span style={{ fontSize: 32, fontWeight: 700, color: '#0751cf' }}>
          {formattedDate}
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'NotoSansSC', data: font, style: 'normal', weight: 700 }],
    }
  )
}

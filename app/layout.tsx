import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import '@/styles/globals.css'

import { GeistMono } from 'geist/font/mono'

import Script from 'next/script'

import Layout from '@/components/Layout'
import { Providers } from './providers'

const isSashimiEnabled = process.env.NEXT_PUBLIC_SASHIMI_ENABLED === 'true'

export const metadata = {
  title: 'Roy Li',
  description: 'Personal blog by Roy Li',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon-180x180.png', sizes: '180x180' }],
  },
  alternates: {
    types: {
      'application/rss+xml': '/blog/feed.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hans" className={`${GeistMono.variable}`}>
      <body>
        {isSashimiEnabled && (
          <Script
            async
            defer
            data-domains="royli.dev"
            data-website-id="aa476cbe-b29c-4e7b-abe0-41f4503e9246"
            src="https://sashimi.royli.dev/sashimi.js"
          />
        )}

        <Providers>
          <main>
            <Layout>{children}</Layout>
          </main>
        </Providers>
      </body>
    </html>
  )
}

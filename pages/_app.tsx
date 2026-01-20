import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
// eslint-disable-next-line import/no-unresolved
import { GeistMono } from 'geist/font/mono'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useMemo, ReactNode } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0/client'

import '@/styles/globals.css'
import Layout from '@/components/Layout'
import NoIndexHead from '@/components/NoIndexHead'
import { ThemeProvider } from '@/lib/theme'

const isSashimiEnabled = process.env.NEXT_PUBLIC_SASHIMI_ENABLED === 'true'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const LoginGuard = useMemo(() => {
    if (
      router.pathname.startsWith('/admin') ||
      router.pathname.startsWith('/login')
    ) {
      return NoIndexHead
    }

    return function WithIndex({ children }: { children: ReactNode }) {
      return <>{children}</>
    }
  }, [router.pathname])

  return (
    <>
      <Head>
        <title>Roy Li</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          key="rss-feed"
          rel="alternative"
          type="application/rss+xml"
          title="RSS feed for royli.dev"
          href="/blog/feed.xml"
        />
      </Head>

      {isSashimiEnabled && (
        <Script
          async
          defer
          data-domains="royli.dev"
          data-website-id="aa476cbe-b29c-4e7b-abe0-41f4503e9246"
          src="https://sashimi.royli.dev/sashimi.js"
        ></Script>
      )}

      <UserProvider>
        <ThemeProvider>
          <main className={`${GeistMono.variable}`}>
            <Layout>
              <LoginGuard>
                <Component {...pageProps} />
              </LoginGuard>
            </Layout>
          </main>
        </ThemeProvider>
      </UserProvider>
    </>
  )
}

export default MyApp

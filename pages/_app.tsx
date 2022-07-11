import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'

import '../styles/globals.css'
import Layout from '../components/Layout'

const isSashimiEnabled = process.env.NEXT_PUBLIC_SASHIMI_ENABLED === 'true'

function MyApp({ Component, pageProps }: AppProps) {
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
          data-website-id="aa476cbe-b29c-4e7b-abe0-41f4503e9246"
          src="https://sashimi.dacdn.top/sashimi.js"
        ></Script>
      )}

      <ThemeProvider attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default MyApp

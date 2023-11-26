import Head from 'next/head'
import * as React from 'react'

import { defaultPageCover, siteURL } from '@/lib/config'

const PageHead = ({
  title,
  description,
  image,
  url,
}: {
  title: string
  description: string | null
  image: string | null
  url: string
}) => {
  const rssFeedUrl = `${siteURL}/feed`
  const socialImageUrl = image || defaultPageCover

  return (
    <Head>
      <meta name="robots" content="index,follow" />
      <meta property="og:type" content="website" />

      <meta property="og:site_name" content="Roy Li" />
      <meta property="twitter:domain" content="royli.dev" />

      <meta name="twitter:creator" content={`@geekdada`} />

      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={socialImageUrl} />
      <meta property="og:image" content={socialImageUrl} />

      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="twitter:url" content={url} />

      <link
        rel="alternate"
        type="application/rss+xml"
        href={rssFeedUrl}
        title="Roy Li"
      />

      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <title>{title}</title>
    </Head>
  )
}

export default PageHead

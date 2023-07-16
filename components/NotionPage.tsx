import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'
import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { NotionRenderer, defaultMapImageUrl } from 'react-notion-x'
import type { ExtendedRecordMap, Block } from 'notion-types'

import { resourceProxyServer } from '../lib/config'
import { isNotionAsset } from '../lib/utils/notion'

const Code = dynamic(() => import('./CodeBlock'), {
  ssr: false,
})
const Collection = dynamic(
  // @ts-ignore
  () =>
    import('react-notion-x/build/third-party/collection').then(
      (m) => m.Collection
    )
)
const Equation = dynamic(
  // @ts-ignore
  () =>
    import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  // @ts-ignore
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  // @ts-ignore
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false,
  }
)
const TweetEmbed = dynamic(
  // @ts-ignore
  () => import('react-tweet-embed'),
  {
    ssr: false,
  }
)
const Tweet = ({ id }: { id: string }) => {
  const { theme } = useTheme()

  if (typeof window === 'undefined') {
    return null
  }

  return (
    <TweetEmbed
      tweetId={id}
      options={{ theme: theme === 'dark' ? 'dark' : 'light' }}
    />
  )
}

interface NotionPageProps {
  recordMap?: ExtendedRecordMap
}

export const NotionPage = ({ recordMap }: NotionPageProps) => {
  const { theme } = useTheme()
  const [notionRendererDarkTheme, setNotionRendererDarkTheme] =
    useState<boolean>()

  const mapImageUrl = useCallback((url: string, block: Block) => {
    if (resourceProxyServer && isNotionAsset(url)) {
      return `${resourceProxyServer}/p/${url}`
    }

    return defaultMapImageUrl(url, block) || url
  }, [])

  const mapPageUrl = useCallback((pageId: string) => {
    return `/api/redirect/${pageId}`
  }, [])

  useEffect(() => {
    setNotionRendererDarkTheme(theme === 'dark')
  }, [theme])

  if (!recordMap) {
    return null
  }

  return (
    <div className="notion-page-renderer">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        hideBlockId
        darkMode={notionRendererDarkTheme}
        previewImages
        showTableOfContents={false}
        showCollectionViewDropdown={false}
        disableHeader
        mapImageUrl={mapImageUrl}
        mapPageUrl={mapPageUrl}
        components={{
          nextImage: Image,
          nextLink: Link,
          Code,
          Collection,
          Equation,
          Pdf,
          Modal,
          Tweet,
        }}
        // NOTE: custom images will only take effect if previewImages is true and
        // if the image has a valid preview image defined in recordMap.preview_images[src]
      />
    </div>
  )
}

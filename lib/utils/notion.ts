import {
  NOTION_ASSETS_ADDRESSES,
  SELF_HOSTED_ASSETS_ADDRESSES,
} from '@/lib/constants'

export const isNotionAsset = (url: string): boolean => {
  return NOTION_ASSETS_ADDRESSES.some((address) => url.includes(address))
}

export const isNotionImageUrl = (url: string): boolean => {
  return url.includes('notion.so/image/')
}

export const isSelfHostedAsset = (url: string): boolean => {
  return SELF_HOSTED_ASSETS_ADDRESSES.some((address) => url.includes(address))
}

export const convertNotionAssetUrl = (
  url: string,
  parentTableType: string,
  blockId: string
): string => {
  if (!isNotionAsset(url)) {
    return url
  }

  const u = new URL(url)

  if (
    (u.pathname.startsWith('/secure.notion-static.com') &&
      u.hostname.endsWith('.amazonaws.com')) ||
    (u.hostname.startsWith('prod-files-secure') &&
      u.hostname.endsWith('.amazonaws.com'))
  ) {
    const keys = Array.from(u.searchParams.keys())

    for (const key of keys) {
      if (key.toLowerCase().startsWith('x-')) {
        u.searchParams.delete(key)
      }
    }

    url = u.toString()
  }

  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`
  }

  url = `https://www.notion.so${
    url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
  }`

  const notionImageUrlV2 = new URL(url)
  let table = parentTableType === 'space' ? 'block' : parentTableType

  if (table === 'collection' || table === 'team') {
    table = 'block'
  }

  notionImageUrlV2.searchParams.set('table', table)
  notionImageUrlV2.searchParams.set('id', blockId)
  notionImageUrlV2.searchParams.set('cache', 'v2')

  url = notionImageUrlV2.toString()

  return url
}

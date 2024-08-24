import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import { isFullPage } from '@notionhq/client'
import type { ExtendedRecordMap } from 'notion-types'
import Bluebird from 'bluebird'
import ms from 'ms'

import { CACHE_KEYS, createCacheLayer } from '@/lib/cache'
import {
  contentDatabaseId,
  pagesDatabaseId,
  tagsDatabaseId,
} from '@/lib/config'
import { getStringProperty } from './utils'
import type {
  Tag,
  PaginatedRequest,
  PaginatedResponse,
  Post,
} from '@/lib/types'
import { notionAPI, notionPrivateAPI } from './client'
import { enrichPostFromPageObjectResponse } from './enrich'

export const getBlogPosts = async (
  { pageSize, startCursor, options }: PaginatedRequest = {
    pageSize: 20,
    options: {},
  }
): Promise<PaginatedResponse<Post>> => {
  const query: QueryDatabaseParameters = {
    database_id: contentDatabaseId,
    filter: {
      and: [{ property: 'Ready to Publish', checkbox: { equals: true } }],
    },
    sorts: [{ property: 'Publish Date', direction: 'descending' }],
    page_size: pageSize,
    start_cursor: startCursor,
  }

  if (options?.tagId && query?.filter && 'and' in query.filter) {
    query.filter.and.push({
      property: 'Tags',
      relation: {
        contains: options.tagId,
      },
    })
  }

  const collection = await notionAPI.databases.query(query)
  const blogList: Post[] = []

  await Bluebird.mapSeries(collection.results, async (item) => {
    if (!isFullPage(item)) {
      return
    }

    const post = await enrichPostFromPageObjectResponse(item, {
      enrichTags: false,
    })

    if (post) {
      blogList.push(post)
    }
  })

  return {
    results: blogList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  }
}

export const getPrivatePageRecordMapByPageId = async (
  pageId: string
): Promise<ExtendedRecordMap> => {
  return notionPrivateAPI.getPage(pageId, {})
}

export const getRawPageByPageId = async (pageId: string) => {
  const page = await notionAPI.pages.retrieve({ page_id: pageId })

  if (!isFullPage(page)) {
    return null
  }

  return page
}

export const getBlogPostBySlug = async (slug: string): Promise<Post | null> => {
  const query: QueryDatabaseParameters = {
    database_id: contentDatabaseId,
    filter: {
      and: [
        { property: 'Ready to Publish', checkbox: { equals: true } },
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
    page_size: 1,
  }
  const collection = await notionAPI.databases.query(query)

  if (collection.results.length === 0) {
    return null
  }

  const item = collection.results[0]

  if (!isFullPage(item)) {
    return null
  }

  return enrichPostFromPageObjectResponse(item, {
    enrichTags: true,
  })
}

export const getPageBySlug = async (slug: string): Promise<Post | null> => {
  const query: QueryDatabaseParameters = {
    database_id: pagesDatabaseId,
    filter: {
      and: [
        { property: 'Ready to Publish', checkbox: { equals: true } },
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
    page_size: 1,
  }
  const collection = await notionAPI.databases.query(query)

  if (collection.results.length === 0) {
    return null
  }

  const item = collection.results[0]

  if (!isFullPage(item)) {
    return null
  }

  return enrichPostFromPageObjectResponse(item, {
    enrichTags: true,
  })
}

export const getPages = async (
  { pageSize, startCursor }: PaginatedRequest = {
    pageSize: 50,
  }
): Promise<PaginatedResponse<Post>> => {
  const query: QueryDatabaseParameters = {
    database_id: pagesDatabaseId,
    filter: {
      and: [{ property: 'Ready to Publish', checkbox: { equals: true } }],
    },
    sorts: [{ property: 'Publish Date', direction: 'descending' }],
    page_size: pageSize,
    start_cursor: startCursor,
  }
  const collection = await notionAPI.databases.query(query)
  const pageList: Post[] = []

  await Bluebird.mapSeries(collection.results, async (item) => {
    if (!isFullPage(item)) {
      return
    }

    const post = await enrichPostFromPageObjectResponse(item, {
      enrichTags: false,
    })

    if (post) {
      pageList.push(post)
    }
  })

  return {
    results: pageList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  }
}

export const getTags = async () => {
  const query: QueryDatabaseParameters = {
    database_id: tagsDatabaseId,
    page_size: 50,
  }
  const collection = await notionAPI.databases.query(query)
  const tags: Tag[] = []

  for (const item of collection.results) {
    if (!isFullPage(item)) {
      continue
    }

    const name = getStringProperty(item, 'Name')
    const slug = getStringProperty(item, 'Slug')
    const description = getStringProperty(item, 'Description') || null

    if (!name || !slug) {
      continue
    }

    const tag: Tag = {
      id: item.id,
      name,
      slug,
      description,
    }

    tags.push(tag)
  }

  return tags
}

export const getCachedBlogPosts = createCacheLayer(
  CACHE_KEYS.BLOG_POSTS,
  getBlogPosts,
  ms('7d')
)

export const getCachedPages = createCacheLayer(
  CACHE_KEYS.PAGES,
  getPages,
  ms('7d')
)

export const getCachedPrivatePageRecordMapByPageId = createCacheLayer(
  CACHE_KEYS.BLOG_POST_BY_PAGE_ID,
  getPrivatePageRecordMapByPageId,
  ms('7d')
)

export const getCachedRawPageByPageId = createCacheLayer(
  CACHE_KEYS.RAW_PAGE,
  getRawPageByPageId,
  ms('7d')
)

export const getCachedBlogPostBySlug = createCacheLayer(
  CACHE_KEYS.BLOG_POST,
  getBlogPostBySlug,
  ms('7d')
)

export const getCachedPageBySlug = createCacheLayer(
  CACHE_KEYS.PAGE,
  getPageBySlug,
  ms('7d')
)

export const getCachedTags = createCacheLayer(
  CACHE_KEYS.TAGS,
  getTags,
  ms('7d')
)

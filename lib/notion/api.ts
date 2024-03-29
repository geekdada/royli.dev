import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import dayjs from 'dayjs'
import ms from 'ms'
import type { ExtendedRecordMap } from 'notion-types'

import { CACHE_KEYS, createCacheLayer } from '@/lib/cache'
import { contentDatabaseId, pagesDatabaseId } from '@/lib/config'
import { Page, PaginatedRequest, PaginatedResponse, Post } from '@/lib/types'
import logger from '@/lib/utils/logger'
import { notionAPI, notionPrivateAPI } from './client'
import {
  getBooleanProperty,
  getDateProperty,
  getPostCoverImage,
  getStringProperty,
} from './utils'

export const getBlogPosts = async (
  { pageSize, startCursor }: PaginatedRequest = {
    pageSize: 50,
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
  const collection = await notionAPI.databases.query(query)
  const blogList: Post[] = []

  collection.results.forEach((item) => {
    if (!('properties' in item)) {
      return
    }

    const rawPost = {
      id: item.id,
      title: getStringProperty(item, 'Name'),
      slug: getStringProperty(item, 'Slug'),
      excerpt: getStringProperty(item, 'Excerpt') || null,
      publishDate:
        getDateProperty(item, 'Publish Date') ||
        getDateProperty(item, 'created_time'),
      lastEditDate: getDateProperty(item, 'Last Edited Time'),
      isFeatured: getBooleanProperty(item, 'Featured') ?? false,
    }
    const requiredProperties: Array<keyof typeof rawPost> = ['slug', 'title']
    const isComplete = requiredProperties.every((key) => Boolean(rawPost[key]))
    const publishYear = dayjs(rawPost.publishDate as string).format('YYYY')
    const coverImage = getPostCoverImage(item)
    const coverIcon = item.icon?.type === 'emoji' ? item.icon.emoji : null

    if (isComplete) {
      blogList.push({
        ...rawPost,
        title: rawPost.title as string,
        slug: rawPost.slug as string,
        publishDate: rawPost.publishDate as string,
        lastEditDate: rawPost.lastEditDate as string,
        readURL: `/blog/${publishYear}/${rawPost.slug}`,
        coverImage,
        coverIcon,
      })
    }
  })

  return {
    results: blogList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  }
}

export const getCachedBlogPosts = createCacheLayer(
  CACHE_KEYS.BLOG_POSTS,
  getBlogPosts,
  ms('24h')
)

export const getPageByPageId = async (
  pageId: string
): Promise<ExtendedRecordMap> => {
  return notionPrivateAPI.getPage(pageId, {})
}

export const getCachedPageByPageId = createCacheLayer(
  CACHE_KEYS.BLOG_POST_BY_PAGE_ID,
  getPageByPageId,
  ms('24h')
)

export const getPages = async (
  { pageSize, startCursor }: PaginatedRequest = {
    pageSize: 50,
  }
): Promise<PaginatedResponse<Page>> => {
  const query: QueryDatabaseParameters = {
    database_id: pagesDatabaseId,
    filter: {
      and: [{ property: 'Publish', checkbox: { equals: true } }],
    },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: pageSize,
    start_cursor: startCursor,
  }
  const collection = await notionAPI.databases.query(query)
  const pageList: Page[] = []

  collection.results.forEach((item) => {
    if (!('properties' in item)) {
      return
    }

    const rawPost = {
      id: item.id,
      title: getStringProperty(item, 'Name'),
      slug: getStringProperty(item, 'Slug'),
      excerpt: getStringProperty(item, 'Excerpt') || null,
      createdTime: getDateProperty(item, 'Created Time'),
      lastEditDate: getDateProperty(item, 'Last Edited Time'),
    }
    const requiredProperties: Array<keyof typeof rawPost> = ['slug', 'title']
    const isComplete = requiredProperties.every((key) => Boolean(rawPost[key]))
    const coverImage = getPostCoverImage(item)
    const coverIcon = item.icon?.type === 'emoji' ? item.icon.emoji : null

    if (isComplete) {
      pageList.push({
        ...rawPost,
        title: rawPost.title as string,
        slug: rawPost.slug as string,
        createdDate: rawPost.createdTime as string,
        lastEditDate: rawPost.lastEditDate as string,
        readURL: `/page/${rawPost.slug}`,
        coverImage,
        coverIcon,
      })
    }
  })

  return {
    results: pageList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  }
}

export const getCachedPages = createCacheLayer(
  CACHE_KEYS.PAGES,
  getPages,
  ms('7d')
)

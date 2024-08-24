import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import dayjs from 'dayjs'

import type { Tag, Post } from '@/lib/types'
import {
  getBooleanProperty,
  getDateProperty,
  getPostCoverImage,
  getStringProperty,
  getRelationProperty,
} from './utils'
import { getCachedRawPageByPageId } from './api'

export const enrichPostFromPageObjectResponse = async (
  pageObjectResponse: PageObjectResponse,
  options: {
    enrichTags?: boolean
  } = {}
): Promise<Post | null> => {
  const rawPost = {
    id: pageObjectResponse.id,
    title: getStringProperty(pageObjectResponse, 'Name'),
    slug: getStringProperty(pageObjectResponse, 'Slug'),
    excerpt: getStringProperty(pageObjectResponse, 'Excerpt') || null,
    publishDate:
      getDateProperty(pageObjectResponse, 'Publish Date') ||
      getDateProperty(pageObjectResponse, 'Created Time'),
    lastEditDate: getDateProperty(pageObjectResponse, 'Last Edited Time'),
    isFeatured: getBooleanProperty(pageObjectResponse, 'Featured') ?? false,
    isGallaryView:
      getBooleanProperty(pageObjectResponse, 'Gallery View') ?? false,
  }
  const requiredProperties: Array<keyof typeof rawPost> = [
    'id',
    'slug',
    'title',
    'publishDate',
  ]

  if (requiredProperties.some((key) => !rawPost[key])) {
    return null
  }

  const publishYear = dayjs(rawPost.publishDate as string).format('YYYY')
  const coverImage = getPostCoverImage(pageObjectResponse)
  const coverIcon =
    pageObjectResponse.icon?.type === 'emoji'
      ? pageObjectResponse.icon.emoji
      : null
  const tagRelations = getRelationProperty(pageObjectResponse, 'Tags')
  let tags: Tag[] | null = null

  if (options.enrichTags && tagRelations) {
    tags = []

    for (const relation of tagRelations) {
      const tagPage = await getCachedRawPageByPageId(relation)

      if (!tagPage) {
        continue
      }

      const name = getStringProperty(tagPage, 'Name')
      const slug = getStringProperty(tagPage, 'Slug')
      const description = getStringProperty(tagPage, 'Description') || null

      if (!name || !slug) {
        continue
      }

      const tag: Tag = {
        id: relation,
        name,
        slug,
        description,
      }

      tags.push(tag)
    }
  }

  return {
    ...rawPost,
    title: rawPost.title as string,
    slug: rawPost.slug as string,
    publishDate: rawPost.publishDate as string,
    lastEditDate: rawPost.lastEditDate as string,
    readURL: `/blog/${publishYear}/${rawPost.slug}`,
    coverImage,
    coverIcon,
    tags,
  }
}

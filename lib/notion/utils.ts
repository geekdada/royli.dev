import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { resourceProxyServer } from '@/lib/config'
import logger from '@/lib/utils/logger'
import { convertNotionAssetUrl, isNotionImageUrl } from '@/lib/utils/notion'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getStringProperty = (
  databaseEntry: PageObjectResponse,
  key: string
): undefined | string | null => {
  const value = databaseEntry.properties[key]

  if (!value) {
    return undefined
  }

  switch (value.type) {
    case 'number':
      return value.number + ''
    case 'url':
      return value.url
    case 'select':
      return value.select?.name || null
    case 'multi_select':
      return value.multi_select?.map((v) => v.name).join(', ') || null
    case 'title':
      return value.title.map((v) => v.plain_text).join('') || null
    case 'rich_text':
      return value.rich_text?.map((v) => v.plain_text).join('') || null
    default:
      logger.warn(
        'key "%s" is of type "%s" instead of "string"',
        key,
        value.type
      )
      return undefined
  }
}

export const getRelationProperty = (
  databaseEntry: PageObjectResponse,
  key: string
): undefined | string[] => {
  const value = databaseEntry.properties[key]

  if (!value) {
    return undefined
  }

  switch (value.type) {
    case 'relation':
      return value.relation?.map((v) => v.id) || []
    default:
      logger.warn(
        'key "%s" is of type "%s" instead of "relation"',
        key,
        value.type
      )
  }
}

export const getDateProperty = (
  databaseEntry: PageObjectResponse,
  key: string
): undefined | string | [string, string] => {
  const value = databaseEntry.properties[key]

  if (!value) {
    return undefined
  }

  switch (value.type) {
    case 'date':
      if (!value.date) return undefined
      if (!value.date.end)
        return dayjs
          .tz(value.date.start, value.date.time_zone || 'UTC')
          .toString()
      return [
        dayjs.tz(value.date.start, value.date.time_zone || 'UTC').toString(),
        dayjs.tz(value.date.end, value.date.time_zone || 'UTC').toString(),
      ]
    case 'last_edited_time':
      return dayjs.tz(value.last_edited_time, 'UTC').toString()
    case 'created_time':
      return dayjs.tz(value.created_time, 'UTC').toString()
    default:
      logger.warn('key %s is of type "%s" instead of "date"', key, value.type)
  }
}

export const getBooleanProperty = (
  databaseEntry: PageObjectResponse,
  key: string
): undefined | boolean => {
  const value = databaseEntry.properties[key]

  if (!value) {
    return undefined
  }

  switch (value.type) {
    case 'checkbox':
      return value.checkbox
    default:
      logger.warn(
        'key "%s" is of type "%s" instead of "boolean"',
        key,
        value.type
      )
  }
}

export const getPostCoverImage = (
  collectionItem: PageObjectResponse
): string | null => {
  const cover = collectionItem.cover

  if (!cover) {
    return null
  }

  let notionImageUrl = null

  switch (cover.type) {
    case 'external':
      notionImageUrl = convertNotionAssetUrl(
        cover.external.url,
        'block',
        collectionItem.id
      )

      break
    case 'file':
      notionImageUrl = convertNotionAssetUrl(
        cover.file.url,
        'block',
        collectionItem.id
      )

      break
  }

  if (resourceProxyServer && isNotionImageUrl(notionImageUrl)) {
    notionImageUrl = `${resourceProxyServer}/v2/p?target=${encodeURIComponent(
      notionImageUrl
    )}`
  }

  return notionImageUrl
}

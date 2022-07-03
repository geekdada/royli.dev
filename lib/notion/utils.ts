import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { Unpacked } from '../types'
import logger from '../utils/logger'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getStringProperty = (
  databaseEntry: Unpacked<QueryDatabaseResponse['results']>,
  key: string
): undefined | string | null => {
  if (!('properties' in databaseEntry)) {
    return undefined
  }

  const value = databaseEntry.properties[key]

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

export const getDateProperty = (
  databaseEntry: Unpacked<QueryDatabaseResponse['results']>,
  key: string
): undefined | string | [string, string] => {
  if (!('properties' in databaseEntry)) {
    return undefined
  }

  const value = databaseEntry.properties[key]

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
  databaseEntry: Unpacked<QueryDatabaseResponse['results']>,
  key: string
): undefined | boolean => {
  if (!('properties' in databaseEntry)) {
    return undefined
  }

  const value = databaseEntry.properties[key]

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
  collectionItem: Unpacked<QueryDatabaseResponse['results']>
): string | null => {
  if (!('properties' in collectionItem)) {
    return null
  }

  const cover = collectionItem.cover

  if (!cover) {
    return null
  }

  switch (cover.type) {
    case 'external':
      return cover.external.url
    case 'file':
      return cover.file.url
  }
}

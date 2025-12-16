import { getEnv } from '@/lib/utils/env'
import { getSiteConfig } from './index'

export const isProd = getEnv('NODE_ENV', 'development') === 'production'

export const siteURL = getSiteConfig('siteURL', 'https://royli.dev')
export const defaultPageCover = getSiteConfig('defaultPageCover')

export const contentDatabaseId = getSiteConfig('contentDatabaseId')
export const pagesDatabaseId = getSiteConfig('pagesDatabaseId')
export const tagsDatabaseId = getSiteConfig('tagsDatabaseId')

export const redisURL = getEnv('REDIS_URL', '')

export const notionKey = getEnv('NOTION_KEY', '')

export const resourceProxyServer = getSiteConfig('resourceProxyServer')

export const siteAdminUserId = getSiteConfig('siteAdminUserId')

export const giteaAPIKey = getEnv('GITEA_API_KEY')

export const karakeepAPIKey = getEnv('KARAKEEP_API_KEY')

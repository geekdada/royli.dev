import { getEnv } from '@/lib/utils/env'
import { getSiteConfig } from './index'

export const isProd = getEnv('NODE_ENV', 'development') === 'production'

export const siteURL = getSiteConfig('siteURL', 'https://royli.dev')
export const defaultPageCover = getSiteConfig('defaultPageCover')

export const giteaAPIKey = getEnv('GITEA_API_KEY', '')

export const karakeepAPIKey = getEnv('KARAKEEP_API_KEY', '')

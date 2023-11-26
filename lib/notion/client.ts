import { NotionAPI } from 'notion-client'
import { Client } from '@notionhq/client'

import { notionKey } from '@/lib/config'

export const notionPrivateAPI = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL,
})

export const notionAPI = new Client({ auth: notionKey })

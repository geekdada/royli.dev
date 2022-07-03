import { NOTION_ASSETS_ADDRESSES } from '../constants/notion'

export const isNotionAsset = (url: string): boolean => {
  return NOTION_ASSETS_ADDRESSES.some((address) => url.includes(address))
}
